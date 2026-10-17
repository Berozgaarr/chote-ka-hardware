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

  // Head Dual-Axis Articulation ("Rotates Automatically in Y and Tilts in X between Customer & Merchant")
  public isAutoTurning: boolean = true;
  private targetHeadAngleY: number = 0; // 0 = Customer side, Math.PI = Merchant side
  private currentHeadAngleY: number = 0;
  private targetHeadAngleX: number = -THREE.MathUtils.degToRad(24); // Ergonomic 24° upward tilt
  private currentHeadAngleX: number = -THREE.MathUtils.degToRad(24);
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

    // Laser-Engraved "paytm | S sarvam.AI" Identity (Clean Apple style)
    const logoGeom = new THREE.PlaneGeometry(0.92, 0.18);
    const logoTexture = this.createBaseLogoTexture();
    const logoMat = new THREE.MeshBasicMaterial({
      map: logoTexture,
      transparent: true,
      depthWrite: false,
    });
    const logoMesh = new THREE.Mesh(logoGeom, logoMat);
    logoMesh.position.set(0, 0.18, baseRadius + 0.006);
    this.baseGroup.add(logoMesh);

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

  // Exact logo graphics matching the concept poster header
  private createBaseLogoTexture(): THREE.CanvasTexture {
    const w = 512;
    const h = 128;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.clearRect(0, 0, w, h);

    const centerY = h * 0.5;

    // "paytm" in bold lowercase
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = '#002970'; // Deep Paytm navy
    ctx.fillText('paytm', 215, centerY);

    // Vertical separator
    ctx.fillStyle = '#64748B';
    ctx.fillRect(235, centerY - 22, 3, 44);

    // Sarvam ribbon icon (gradient shape)
    const iconX = 258;
    const grad = ctx.createLinearGradient(iconX, centerY - 20, iconX + 30, centerY + 20);
    grad.addColorStop(0, '#00BAF2');
    grad.addColorStop(1, '#6366F1');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(iconX, centerY - 18, 28, 36, [10, 4, 10, 4]);
    ctx.fill();

    // "sarvam.AI"
    ctx.textAlign = 'left';
    ctx.font = 'bold 38px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText('sarvam.AI', iconX + 38, centerY);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // 2. SLENDER APPLE PRO STAND DUAL-AXIS GIMBAL NECK
  // Slim, high-precision satin aluminum spindle and compact transverse friction hinge
  private buildRoboticGimbalNeck() {
    const neckBaseY = 0.50;

    // A. Recessed Bearing Sleeve Collar on Base
    const collarGeom = new THREE.CylinderGeometry(0.32, 0.38, 0.10, 48);
    const collarMesh = new THREE.Mesh(collarGeom, this.darkChassisMat);
    collarMesh.position.set(0, neckBaseY + 0.05, 0);
    collarMesh.castShadow = true;
    this.neckGroup.add(collarMesh);

    // B. Slender Satin Aluminum Rotation Rod / Spindle (Dual-axis Y rotation)
    const rodRadius = 0.14;
    const rodHeight = 0.54;
    const rodGeom = new THREE.CylinderGeometry(rodRadius, rodRadius, rodHeight, 48);
    const rodMesh = new THREE.Mesh(rodGeom, this.metalAccentMat);
    rodMesh.position.set(0, neckBaseY + 0.08 + rodHeight / 2, 0);
    rodMesh.castShadow = true;
    this.neckGroup.add(rodMesh);

    // Precision tolerance accent sleeve on spindle
    const sleeveGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.10, 48);
    const sleeveMesh = new THREE.Mesh(sleeveGeom, this.darkChassisMat);
    sleeveMesh.position.set(0, neckBaseY + 0.26, 0);
    this.neckGroup.add(sleeveMesh);

    // C. Compact Apple Pro Stand Transverse Friction Tilt Hinge (Dual-axis X tilt)
    const hingeY = neckBaseY + rodHeight + 0.12; // ~ 1.16
    const hingeZ = -0.16; // Sits neatly behind the display plane

    // Hinge Clevis Mount
    const hingeBaseGeom = new RoundedBoxGeometry(0.44, 0.16, 0.24, 4, 0.05);
    const hingeBaseMesh = new THREE.Mesh(hingeBaseGeom, this.darkChassisMat);
    hingeBaseMesh.position.set(0, hingeY - 0.06, hingeZ);
    this.neckGroup.add(hingeBaseMesh);

    // Horizontal Transverse Hinge Barrel Pin (Axis of Lift/Tilt)
    const hingeBarrelGeom = new THREE.CylinderGeometry(0.10, 0.10, 0.64, 36);
    hingeBarrelGeom.rotateZ(Math.PI / 2);
    const hingeBarrelMesh = new THREE.Mesh(hingeBarrelGeom, this.metalAccentMat);
    hingeBarrelMesh.position.set(0, hingeY, hingeZ);
    hingeBarrelMesh.castShadow = true;
    this.headGroup.add(hingeBarrelMesh);

    // Twin Structural Lift Knuckles clamping into rear display head
    [-0.24, 0.24].forEach(x => {
      // Knuckle cap
      const capGeom = new THREE.CylinderGeometry(0.13, 0.13, 0.06, 28);
      capGeom.rotateZ(Math.PI / 2);
      const capMesh = new THREE.Mesh(capGeom, this.darkChassisMat);
      capMesh.position.set(x, hingeY, hingeZ);
      this.headGroup.add(capMesh);

      // Diamond-cut CNC end cap screw
      const screwGeom = new THREE.CylinderGeometry(0.07, 0.07, 0.015, 20);
      screwGeom.rotateZ(Math.PI / 2);
      const screwMesh = new THREE.Mesh(screwGeom, this.metalAccentMat);
      screwMesh.position.set(x > 0 ? x + 0.035 : x - 0.035, hingeY, hingeZ);
      this.headGroup.add(screwMesh);

      // Angled Lift Arm Bracket bridging hinge barrel to the rear display chassis
      const armGeom = new THREE.BoxGeometry(0.08, 0.34, 0.14);
      armGeom.rotateX(THREE.MathUtils.degToRad(-20));
      const armMesh = new THREE.Mesh(armGeom, this.darkChassisMat);
      armMesh.position.set(x, hingeY + 0.15, hingeZ + 0.06);
      armMesh.castShadow = true;
      this.headGroup.add(armMesh);
    });

    // Central Stiffener / Cable Conduit Spine behind the display
    const spineGeom = new THREE.BoxGeometry(0.26, 0.38, 0.12);
    spineGeom.rotateX(THREE.MathUtils.degToRad(-20));
    const spineMesh = new THREE.Mesh(spineGeom, this.darkChassisMat);
    spineMesh.position.set(0, hingeY + 0.16, hingeZ + 0.06);
    this.headGroup.add(spineMesh);
  }

  // 3. BEZEL-LESS UNIBODY DISPLAY MONITOR (Solid Proportion & Edge-to-Edge Glass)
  // Perfectly balanced thickness (depth 0.18) with the base, and zero bezel borders!
  private buildDisplayHead() {
    const headCenterY = 1.95;
    const headCenterZ = 0.02;
    const tiltAngleRad = THREE.MathUtils.degToRad(22); // Ergonomic 22° upward lift angle

    this.screenGroup.position.set(0, headCenterY, headCenterZ);
    this.screenGroup.rotation.x = -tiltAngleRad;

    // Monitor dimensions: Proportionally balanced with the pedestal base
    const headWidth = 2.72;
    const headHeight = 1.80;
    const headDepth = 0.18; // Balanced premium thickness (not paper-thin, not chunky)
    const cornerRadius = 0.14; // Minimal modern corner curvature

    // 1. Unibody Precision CNC Aluminum Casing
    const lidGeom = new RoundedBoxGeometry(headWidth, headHeight, headDepth, 8, cornerRadius);
    const lidMesh = new THREE.Mesh(lidGeom, this.titaniumBaseMat);
    lidMesh.position.set(0, 0, -headDepth * 0.5);
    lidMesh.castShadow = true;
    lidMesh.receiveShadow = true;
    this.screenGroup.add(lidMesh);

    // Subtle laser-etched rear "CHOTU" logo mark on back of monitor
    const rearBadgeGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.005, 32);
    rearBadgeGeom.rotateX(Math.PI / 2);
    const rearBadgeMesh = new THREE.Mesh(rearBadgeGeom, new THREE.MeshStandardMaterial({
      color: 0x94A3B8,
      metalness: 0.9,
      roughness: 0.2,
    }));
    rearBadgeMesh.position.set(0, 0, -headDepth - 0.002);
    this.screenGroup.add(rearBadgeMesh);

    // Dual Top Far-Field Microphone Apertures (precision laser-drilled on top rim)
    [-0.45, 0.45].forEach(x => {
      const micGeom = new THREE.CylinderGeometry(0.014, 0.014, 0.02, 16);
      const micMat = new THREE.MeshBasicMaterial({ color: 0x040608 });
      const micMesh = new THREE.Mesh(micGeom, micMat);
      micMesh.position.set(x, headHeight / 2 - 0.005, -headDepth * 0.5);
      this.screenGroup.add(micMesh);
    });

    // 2. Bezel-Less Edge-to-Edge Glass Screen (Takes up the entire front face)
    const glassGeom = new THREE.PlaneGeometry(headWidth, headHeight);
    const glassMesh = new THREE.Mesh(glassGeom, new THREE.MeshBasicMaterial({ color: 0x000000 }));
    glassMesh.position.set(0, 0, 0.001);
    this.screenGroup.add(glassMesh);

    // 3. Screen Aperture Cutout for CSS3D Iframe (Full edge-to-edge active display area)
    const displayGeom = new THREE.PlaneGeometry(headWidth, headHeight);
    const displayMesh = new THREE.Mesh(displayGeom, this.glossyBlackScreenMat);
    displayMesh.position.set(0, 0, 0.002);
    this.screenGroup.add(displayMesh);
  }

  // Toggle head facing: Customer Side (0 rad) <-> Merchant Side (Math.PI rad)
  public toggleSide() {
    if (this.targetHeadAngleY === 0) {
      this.targetHeadAngleY = Math.PI; // Swivel around to Merchant
      this.targetHeadAngleX = -THREE.MathUtils.degToRad(18); // Flatter angle for merchant counter
    } else {
      this.targetHeadAngleY = 0; // Swivel back to Customer
      this.targetHeadAngleX = -THREE.MathUtils.degToRad(26); // Tilted up for standing customer
    }
  }

  // Programmatic manual angle controls
  public setHeadAngles(yawY: number, pitchX?: number) {
    this.targetHeadAngleY = yawY;
    if (pitchX !== undefined) {
      this.targetHeadAngleX = pitchX;
    }
  }

  public update(delta: number) {
    this.animTime += delta;

    // 1. Dual-Axis Articulation: Smooth robotic interpolation in both Y (Yaw) and X (Pitch)
    this.currentHeadAngleY = THREE.MathUtils.lerp(this.currentHeadAngleY, this.targetHeadAngleY, delta * 3.2);
    this.headGroup.rotation.y = this.currentHeadAngleY;

    // Subtle dynamic breathing pitch tilt along X (mimicking organic robotic attention)
    const organicNod = Math.sin(this.animTime * 1.8) * THREE.MathUtils.degToRad(2.2);
    const desiredX = this.targetHeadAngleX + organicNod;
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

    // 3. Auto-demo rotation: every 8.5 seconds, smoothly articulate between merchant and customer
    if (this.isAutoTurning) {
      this.turnTimer += delta;
      if (this.turnTimer > 8.5) {
        this.turnTimer = 0;
        this.toggleSide();
      }
    }
  }
}
