// Revamped 3D Model of "CHOTU" - Smart Voice Assistant Soundbox
// Built strictly according to reference hardware design:
// Brushed titanium base with cyan underglow, motorized gimbal neck,
// and squircle floating display head with glowing cyan halo perimeter ring.

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export class ChotuSoundbox3D {
  public root: THREE.Group;
  
  // Key structural groups
  public baseGroup: THREE.Group;
  public neckGroup: THREE.Group;
  public headGroup: THREE.Group;
  public screenGroup: THREE.Group;

  // PBR Materials
  private titaniumBaseMat: THREE.MeshPhysicalMaterial;
  private darkChassisMat: THREE.MeshPhysicalMaterial;
  private glossyBlackScreenMat: THREE.MeshBasicMaterial;
  private cyanNeonMat: THREE.MeshBasicMaterial;
  private metalAccentMat: THREE.MeshStandardMaterial;

  // Head Dual-Axis Articulation ("Rotates Programmatically in Y and Tilts in X between Customer & Merchant")
  public isAutoTurning: boolean = false;
  private targetHeadAngleY: number = 0; // 0 = Customer side, Math.PI = Merchant side
  private currentHeadAngleY: number = 0;
  private targetHeadAngleX: number = -THREE.MathUtils.degToRad(26); // Ergonomic 26° upward tilt
  private currentHeadAngleX: number = -THREE.MathUtils.degToRad(26);
  private turnTimer: number = 0;
  private animTime: number = 0;

  // Halo pulse intensity
  private haloLightMesh: THREE.Mesh | null = null;
  private baseLightMesh: THREE.Mesh | null = null;

  constructor() {
    this.root = new THREE.Group();
    this.root.name = 'ChotuSoundbox';

    this.baseGroup = new THREE.Group();
    this.neckGroup = new THREE.Group();
    this.headGroup = new THREE.Group();
    this.screenGroup = new THREE.Group();

    this.root.add(this.baseGroup);
    this.root.add(this.neckGroup);
    this.neckGroup.add(this.headGroup);
    this.headGroup.add(this.screenGroup);

    // 1. Natural Anodized Bead-Blasted Aluminum (Apple Mac / Studio Display grade)
    this.titaniumBaseMat = new THREE.MeshPhysicalMaterial({
      color: 0xDCE2EB, // Crisp Apple bead-blasted silver
      metalness: 0.88,
      roughness: 0.16,
      clearcoat: 0.50,
      clearcoatRoughness: 0.12,
      reflectivity: 0.95,
      envMapIntensity: 1.30,
    });

    // 2. Midnight Matte Dark Polycarbonate / Space Black Shell (Apple style)
    this.darkChassisMat = new THREE.MeshPhysicalMaterial({
      color: 0x181B22,
      metalness: 0.40,
      roughness: 0.22,
      clearcoat: 0.55,
      clearcoatRoughness: 0.14,
      envMapIntensity: 1.10,
    });

    // 3. Diamond-Cut Specular CNC Aluminum Trim
    this.metalAccentMat = new THREE.MeshStandardMaterial({
      color: 0xF2F6FA,
      metalness: 0.94,
      roughness: 0.10,
      envMapIntensity: 1.40,
    });

    // 4. Paytm Signature Cyan Neon Light Ring (Crisp, slender laser line)
    this.cyanNeonMat = new THREE.MeshBasicMaterial({
      color: 0x00BAF2,
    });

    // 5. Screen Occluder Mesh for CSS3D Iframe
    this.glossyBlackScreenMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      opacity: 0,
      blending: THREE.NoBlending,
    });

    this.buildBaseAssembly();
    this.buildRoboticGimbalNeck();
    this.buildDisplayHead();
  }

  // 1. BASE ASSEMBLY (Ultra-Slim Apple-grade Aluminum Pedestal Puck with Chamfers & Laser Engraving)
  private buildBaseAssembly() {
    const baseRadius = 1.30; // Compact, graceful footprint
    const baseHeight = 0.44; // Sleek low profile puck (not chunky or heavy!)

    // Chamfered Lower Foot Ring with silicone anti-slip gasket
    const footGeom = new THREE.CylinderGeometry(baseRadius, baseRadius * 0.96, 0.08, 64);
    const footMesh = new THREE.Mesh(footGeom, this.titaniumBaseMat);
    footMesh.position.y = 0.04;
    footMesh.castShadow = true;
    footMesh.receiveShadow = true;
    this.baseGroup.add(footMesh);

    // Silicone base gasket
    const gasketGeom = new THREE.CylinderGeometry(baseRadius * 0.92, baseRadius * 0.92, 0.02, 48);
    const gasketMat = new THREE.MeshStandardMaterial({ color: 0x1E222B, roughness: 0.9 });
    const gasketMesh = new THREE.Mesh(gasketGeom, gasketMat);
    gasketMesh.position.y = 0.01;
    this.baseGroup.add(gasketMesh);

    // Recessed Slender Cyan Under-Glow LED Ring
    const underglowGeom = new THREE.TorusGeometry(baseRadius * 0.94, 0.018, 16, 64);
    underglowGeom.rotateX(Math.PI / 2);
    const underglowMesh = new THREE.Mesh(underglowGeom, this.cyanNeonMat);
    underglowMesh.position.y = 0.025;
    this.baseGroup.add(underglowMesh);

    // Main Cylindrical Body
    const cylHeight = baseHeight - 0.16;
    const cylGeom = new THREE.CylinderGeometry(baseRadius, baseRadius, cylHeight, 64);
    const cylMesh = new THREE.Mesh(cylGeom, this.titaniumBaseMat);
    cylMesh.position.y = 0.08 + cylHeight / 2;
    cylMesh.castShadow = true;
    cylMesh.receiveShadow = true;
    this.baseGroup.add(cylMesh);

    // Diamond-cut CNC groove separating cylinder and top crown
    const grooveGeom = new THREE.TorusGeometry(baseRadius + 0.002, 0.006, 12, 64);
    grooveGeom.rotateX(Math.PI / 2);
    const grooveMesh = new THREE.Mesh(grooveGeom, this.metalAccentMat);
    grooveMesh.position.y = 0.08;
    this.baseGroup.add(grooveMesh);

    // Slender Front Cyan Status Diffuser Bar
    const ledBarGeom = new THREE.BoxGeometry(0.28, 0.024, 0.02);
    const ledBarMesh = new THREE.Mesh(ledBarGeom, this.cyanNeonMat);
    ledBarMesh.position.set(0, 0.32, baseRadius + 0.003);
    this.baseLightMesh = ledBarMesh;
    this.baseGroup.add(ledBarMesh);

    // Elegant Top Crown Chamfer
    const crownGeom = new THREE.CylinderGeometry(baseRadius * 0.88, baseRadius, 0.08, 64);
    const crownMesh = new THREE.Mesh(crownGeom, this.titaniumBaseMat);
    crownMesh.position.y = baseHeight + 0.02;
    crownMesh.castShadow = true;
    this.baseGroup.add(crownMesh);

    // Diamond-Turned Bearing Collar Ring
    const bearingRingGeom = new THREE.CylinderGeometry(0.42, 0.50, 0.03, 64);
    const bearingRingMesh = new THREE.Mesh(bearingRingGeom, this.metalAccentMat);
    bearingRingMesh.position.y = baseHeight + 0.055;
    this.baseGroup.add(bearingRingMesh);
  }

  // 2. SLENDER APPLE PRO STAND DUAL-AXIS GIMBAL NECK & CENTER-MOUNTED HINGE HUB
  // Slender satin aluminum vertical spindle and sleek circular friction hinge mounted right at the screen center
  private buildRoboticGimbalNeck() {
    const neckBaseY = 0.50;
    const hingeY = 1.95;
    const hingeZ = -0.22; // Safely set back behind the 0.18 thick casing

    // B. Slender Satin Aluminum Rotation Rod / Spindle (Dual-axis Y rotation)
    // Vertical spindle goes up to connect directly into the cradle base behind the screen
    const rodRadius = 0.12;
    const rodTopY = hingeY - 0.08; // Connects flush to bottom of cradleMesh (cradle is at hingeY with height 0.16)
    const rodHeight = rodTopY - (neckBaseY + 0.08);
    const rodGeom = new THREE.CylinderGeometry(rodRadius, rodRadius, rodHeight, 48);
    const rodMesh = new THREE.Mesh(rodGeom, this.metalAccentMat);
    // Position rod tangent to hingeZ
    rodMesh.position.set(0, neckBaseY + 0.08 + rodHeight / 2, hingeZ - 0.08);
    rodMesh.castShadow = true;
    this.headGroup.add(rodMesh);

    // Precision tolerance accent sleeve on spindle
    const sleeveGeom = new THREE.CylinderGeometry(0.16, 0.16, 0.10, 48);
    const sleeveMesh = new THREE.Mesh(sleeveGeom, this.darkChassisMat);
    sleeveMesh.position.set(0, neckBaseY + 0.36, hingeZ - 0.08);
    this.headGroup.add(sleeveMesh);

    // Recessed Bearing Sleeve Collar on Base
    const collarGeom = new THREE.CylinderGeometry(0.32, 0.38, 0.10, 48);
    const collarMesh = new THREE.Mesh(collarGeom, this.darkChassisMat);
    collarMesh.position.set(0, neckBaseY + 0.05, hingeZ - 0.08);
    collarMesh.castShadow = true;
    this.neckGroup.add(collarMesh);

    // C. Center Hinge Hub mounted directly in the middle of the display's backside
    // When screenGroup tilts upward around (0, hingeY, hingeZ), the back surface stays behind z = -headDepth (-0.18)
    // 1. Spindle top cradle head supporting the transverse hinge
    const cradleGeom = new RoundedBoxGeometry(0.36, 0.16, 0.16, 4, 0.04);
    const cradleMesh = new THREE.Mesh(cradleGeom, this.titaniumBaseMat);
    cradleMesh.position.set(0, hingeY, hingeZ - 0.08);
    cradleMesh.castShadow = true;
    this.headGroup.add(cradleMesh);

    // 2. High-Precision Transverse Friction Barrel Axis (The actual mechanical hinge axis)
    const barrelGeom = new THREE.CylinderGeometry(0.065, 0.065, 0.40, 36);
    barrelGeom.rotateZ(Math.PI / 2);
    const barrelMesh = new THREE.Mesh(barrelGeom, this.metalAccentMat);
    barrelMesh.position.set(0, hingeY, hingeZ - 0.08);
    barrelMesh.castShadow = true;
    this.headGroup.add(barrelMesh);

    // End-caps with diamond-cut bevels on left & right of the hinge barrel
    [-0.20, 0.20].forEach(x => {
      const capGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.03, 32);
      capGeom.rotateZ(Math.PI / 2);
      const capMesh = new THREE.Mesh(capGeom, this.darkChassisMat);
      capMesh.position.set(x, hingeY, hingeZ - 0.08);
      this.headGroup.add(capMesh);

      const boltGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.012, 20);
      boltGeom.rotateZ(Math.PI / 2);
      const boltMesh = new THREE.Mesh(boltGeom, this.metalAccentMat);
      boltMesh.position.set(x > 0 ? x + 0.016 : x - 0.016, hingeY, hingeZ - 0.08);
      this.headGroup.add(boltMesh);
    });

    // 3. Apple-style Center Backplate Mounting Bracket on Screen (tilts with screenGroup)
    // Sits on the back surface of the screen casing: z <= -0.18
    const bracketPlateGeom = new THREE.CylinderGeometry(0.24, 0.25, 0.025, 48);
    bracketPlateGeom.rotateX(Math.PI / 2);
    const bracketPlateMesh = new THREE.Mesh(bracketPlateGeom, this.darkChassisMat);
    bracketPlateMesh.position.set(0, 0, -0.18 - 0.015);
    this.screenGroup.add(bracketPlateMesh);

    // Precision CNC hinge clamp bridging bracket backplate to transverse barrel
    const clampGeom = new RoundedBoxGeometry(0.18, 0.14, 0.08, 4, 0.02);
    const clampMesh = new THREE.Mesh(clampGeom, this.metalAccentMat);
    clampMesh.position.set(0, 0, -0.18 - 0.06);
    clampMesh.castShadow = true;
    this.screenGroup.add(clampMesh);
  }

  // 3. BEZEL-LESS UNIBODY DISPLAY MONITOR (Solid Proportion & Edge-to-Edge Glass)
  // Flush, zero-displacement front aperture so screen never separates from body!
  private buildDisplayHead() {
    const headCenterY = 1.95; // Screen center height
    const headCenterZ = 0.0; // Display front face at z = 0, back at z = -headDepth (-0.18)

    this.screenGroup.position.set(0, headCenterY, headCenterZ);
    this.screenGroup.rotation.x = -THREE.MathUtils.degToRad(20);

    // Monitor dimensions: Proportionally balanced with the pedestal base
    const headWidth = 2.72;
    const headHeight = 1.80;
    const headDepth = 0.18; // Balanced premium thickness
    const cornerRadius = 0.14; // Minimal modern corner curvature

    // 1. Unibody Precision CNC Aluminum Casing
    const lidGeom = new RoundedBoxGeometry(headWidth, headHeight, headDepth, 8, cornerRadius);
    const lidMesh = new THREE.Mesh(lidGeom, this.titaniumBaseMat);
    // Casing centered at z = -headDepth * 0.5, so front edge is exactly at z = 0
    lidMesh.position.set(0, 0, -headDepth * 0.5);
    lidMesh.castShadow = true;
    lidMesh.receiveShadow = true;
    this.screenGroup.add(lidMesh);

    // Dual Top Far-Field Microphone Apertures (precision laser-drilled on top rim)
    [-0.45, 0.45].forEach(x => {
      const micGeom = new THREE.CylinderGeometry(0.014, 0.014, 0.02, 16);
      const micMat = new THREE.MeshBasicMaterial({ color: 0x040608 });
      const micMesh = new THREE.Mesh(micGeom, micMat);
      micMesh.position.set(x, headHeight / 2 - 0.005, -headDepth * 0.5);
      this.screenGroup.add(micMesh);
    });

    // 2. Screen Aperture Cutout for CSS3D Iframe (punches transparent hole in WebGL canvas)
    const screenBaseGeom = new THREE.PlaneGeometry(headWidth, headHeight);
    const screenBaseMesh = new THREE.Mesh(screenBaseGeom, this.glossyBlackScreenMat);
    screenBaseMesh.position.set(0, 0, 0.001);
    this.screenGroup.add(screenBaseMesh);
  }

  // Toggle head facing: Customer Side (0 rad) <-> Merchant Side (Math.PI rad)
  public toggleSide() {
    if (Math.abs(this.targetHeadAngleY) < 0.1) {
      this.rotateToMerchant();
    } else {
      this.rotateToCustomer();
    }
  }

  // Programmatic rotation API with physical hinge caps:
  // Hinge max rotation capped strictly at 180° in yaw and realistic pitch limit [-40°, 40°]
  public rotateToCustomer() {
    this.targetHeadAngleY = 0; // 0 deg (Customer)
    this.targetHeadAngleX = -THREE.MathUtils.degToRad(20); // 20° upward tilt
  }

  public rotateToMerchant() {
    this.targetHeadAngleY = Math.PI; // 180 deg (Merchant)
    this.targetHeadAngleX = -THREE.MathUtils.degToRad(16); // 16° counter tilt
  }

  public setRotationDegrees(yawDeg: number, pitchDeg?: number) {
    // Restrict yaw to max 180° (-180° to +180°)
    const clampedYaw = THREE.MathUtils.clamp(yawDeg, -180, 180);
    this.targetHeadAngleY = THREE.MathUtils.degToRad(clampedYaw);

    if (pitchDeg !== undefined) {
      // Restrict pitch tilt based on physical hinge limit [-40° to +40°]
      const clampedPitch = THREE.MathUtils.clamp(pitchDeg, -40, 40);
      this.targetHeadAngleX = THREE.MathUtils.degToRad(clampedPitch);
    }
  }

  // Programmatic manual angle controls in radians
  public setHeadAngles(yawY: number, pitchX?: number) {
    this.targetHeadAngleY = THREE.MathUtils.clamp(yawY, -Math.PI, Math.PI);
    if (pitchX !== undefined) {
      this.targetHeadAngleX = THREE.MathUtils.clamp(pitchX, -THREE.MathUtils.degToRad(40), THREE.MathUtils.degToRad(40));
    }
  }

  public getRotation() {
    return {
      yawDeg: Math.round(THREE.MathUtils.radToDeg(this.currentHeadAngleY) * 10) / 10,
      pitchDeg: Math.round(THREE.MathUtils.radToDeg(this.currentHeadAngleX) * 10) / 10,
      targetYawDeg: Math.round(THREE.MathUtils.radToDeg(this.targetHeadAngleY) * 10) / 10,
      targetPitchDeg: Math.round(THREE.MathUtils.radToDeg(this.targetHeadAngleX) * 10) / 10,
      isAutoTurning: this.isAutoTurning
    };
  }

  public update(delta: number) {
    this.animTime += delta;

    // 1. Dual-Axis Articulation: Smooth robotic interpolation in both Y (Yaw) and X (Pitch)
    // Capped strictly within hinge mechanical stops
    this.currentHeadAngleY = THREE.MathUtils.lerp(this.currentHeadAngleY, this.targetHeadAngleY, delta * 3.2);
    this.headGroup.rotation.y = this.currentHeadAngleY;

    // Subtle micro-organic attention tilt strictly within hinge bounds
    const organicNod = Math.sin(this.animTime * 1.8) * THREE.MathUtils.degToRad(1.5);
    const desiredX = THREE.MathUtils.clamp(
      this.targetHeadAngleX + organicNod,
      -THREE.MathUtils.degToRad(40),
      THREE.MathUtils.degToRad(40)
    );
    this.currentHeadAngleX = THREE.MathUtils.lerp(this.currentHeadAngleX, desiredX, delta * 3.5);
    this.screenGroup.rotation.x = this.currentHeadAngleX;

    // 2. Subtle ambient breathing glow on halo
    const pulse = Math.sin(this.animTime * 3.0) * 0.25 + 0.85;
    if (this.haloLightMesh) {
      (this.haloLightMesh.material as THREE.MeshBasicMaterial).color.setRGB(0, 0.73 * pulse, 0.95 * pulse);
    }
    if (this.baseLightMesh) {
      (this.baseLightMesh.material as THREE.MeshBasicMaterial).color.setRGB(0, 0.73 * pulse, 0.95 * pulse);
    }

    // 3. Auto-demo rotation: every 8.5 seconds if enabled
    if (this.isAutoTurning) {
      this.turnTimer += delta;
      if (this.turnTimer > 8.5) {
        this.turnTimer = 0;
        this.toggleSide();
      }
    }
  }
}
