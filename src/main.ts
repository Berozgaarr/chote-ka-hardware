import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { ChotuSoundbox3D } from './soundbox';

class App {
  public container: HTMLElement;
  public scene: THREE.Scene;
  public cssScene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public cssRenderer: CSS3DRenderer;
  public controls: OrbitControls;
  public soundbox: ChotuSoundbox3D;
  public clock: THREE.Clock;
  public screenIframeObject: CSS3DObject | null = null;

  // Studio Lights
  private keyLight: THREE.DirectionalLight;
  private fillLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;
  private rimLight: THREE.PointLight;

  constructor() {
    const el = document.getElementById('canvas-container');
    if (!el) throw new Error('Missing canvas-container element');
    this.container = el;

    this.clock = new THREE.Clock();

    // 1. CSS3D Scene & Renderer (for interactive real GUI iframe)
    this.cssScene = new THREE.Scene();
    this.cssRenderer = new CSS3DRenderer();
    this.cssRenderer.setSize(window.innerWidth, window.innerHeight);
    this.cssRenderer.domElement.style.position = 'absolute';
    this.cssRenderer.domElement.style.top = '0';
    this.cssRenderer.domElement.style.left = '0';
    this.cssRenderer.domElement.style.width = '100%';
    this.cssRenderer.domElement.style.height = '100%';
    this.container.appendChild(this.cssRenderer.domElement);

    // 2. WebGL 3D Scene with Clean Apple Light-Mode Studio
    this.scene = new THREE.Scene();

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    this.camera.position.set(3.6, 3.4, 4.8);

    // Transparent WebGL canvas so CSS3D iframe and studio background align seamlessly
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.pointerEvents = 'none'; // Enables orbit drag on canvas
    this.container.appendChild(this.renderer.domElement);

    // 3. Orbit Controls attached to cssRenderer
    this.controls = new OrbitControls(this.camera, this.cssRenderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 1.4, 0);
    this.controls.maxPolarAngle = Math.PI / 2 + 0.02;
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 14.0;

    // 4. Studio Lighting Rig - Apple Key/Fill/Rim softbox ratio
    this.hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x94A3B8, 0.7);
    this.scene.add(this.hemiLight);

    this.keyLight = new THREE.DirectionalLight(0xFFFFFF, 1.6);
    this.keyLight.position.set(5, 8, 5);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.bias = -0.0005;
    this.keyLight.shadow.camera.near = 1;
    this.keyLight.shadow.camera.far = 25;
    this.keyLight.shadow.camera.left = -4;
    this.keyLight.shadow.camera.right = 4;
    this.keyLight.shadow.camera.top = 5;
    this.keyLight.shadow.camera.bottom = -2;
    this.scene.add(this.keyLight);

    this.fillLight = new THREE.DirectionalLight(0xC8D8E8, 0.8);
    this.fillLight.position.set(-5, 4, -3);
    this.scene.add(this.fillLight);

    this.rimLight = new THREE.PointLight(0x00BAF2, 2.0, 15);
    this.rimLight.position.set(0, 4.0, -3.0);
    this.scene.add(this.rimLight);

    // Front studio softbox key light for soft metallic definition without blowing out highlights
    const frontFillLight = new THREE.DirectionalLight(0xF1F5F9, 1.1);
    frontFillLight.position.set(0, 2.5, 6);
    this.scene.add(frontFillLight);

    // Studio Countertop & Contact Shadows
    this.buildStudioFloor();

    // 4b. Apple-grade HDR Studio Environment for metallic reflections
    this.setupStudioEnvironment();

    // 3D CHOTU Smart Voice Assistant Device
    this.soundbox = new ChotuSoundbox3D();
    this.scene.add(this.soundbox.root);

    // 5. Mount Real Interactive GUI Iframe on Screen
    this.setupScreenIframe();

    // Frame the 3D model with iframe perfectly on screen
    this.fitToScreen();

    window.addEventListener('resize', this.onResize.bind(this));
    this.animate();
  }

  private setupScreenIframe() {
    // Supports custom GUI via query param: e.g. http://localhost:5173/?gui=/display.html
    const urlParams = new URLSearchParams(window.location.search);
    const guiUrl = urlParams.get('gui') || '/display.html';

    const iframe = document.createElement('iframe');
    iframe.src = guiUrl;
    iframe.style.width = '1024px';
    iframe.style.height = '678px';
    iframe.style.border = '0';
    iframe.style.borderRadius = '24px';
    iframe.style.backgroundColor = '#02040A';
    iframe.style.pointerEvents = 'none'; // Voice-only device: non-touch screen as per spec

    const cssObject = new CSS3DObject(iframe);

    // Screen aperture dimensions: edge-to-edge bezel-less width 2.72, height 1.80
    const scaleX = 2.72 / 1024;
    const scaleY = 1.80 / 678;
    cssObject.scale.set(scaleX, scaleY, 1);

    this.cssScene.add(cssObject);
    this.screenIframeObject = cssObject;
  }

  // Generates high-fidelity Apple-style studio environment reflections
  private setupStudioEnvironment() {
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();

    // Create a 360 studio panorama on a canvas with softboxes and overhead diffuser
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const ctx = envCanvas.getContext('2d');
    if (ctx) {
      // Clean neutral Apple studio ambient gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
      bgGrad.addColorStop(0, '#EAEFF5');
      bgGrad.addColorStop(0.5, '#F8FAFC');
      bgGrad.addColorStop(1, '#D8E0EA');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1024, 512);

      // Overhead softbox light strip
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(200, 40, 624, 80);

      // Key softbox on left
      const keyGrad = ctx.createRadialGradient(250, 220, 10, 250, 220, 160);
      keyGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      keyGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
      keyGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = keyGrad;
      ctx.fillRect(50, 80, 400, 300);

      // Rim softbox on right
      const rimGrad = ctx.createRadialGradient(780, 220, 10, 780, 220, 140);
      rimGrad.addColorStop(0, 'rgba(216, 238, 255, 0.9)');
      rimGrad.addColorStop(0.6, 'rgba(216, 238, 255, 0.25)');
      rimGrad.addColorStop(1, 'rgba(216, 238, 255, 0)');
      ctx.fillStyle = rimGrad;
      ctx.fillRect(600, 80, 360, 300);
    }

    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    const envMap = pmremGenerator.fromEquirectangular(envTexture).texture;
    this.scene.environment = envMap;
    pmremGenerator.dispose();
  }

  private fitToScreen() {
    const box = new THREE.Box3().setFromObject(this.soundbox.root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Center focal plane on the joint & upper base region for balanced hero product framing
    const focusPoint = new THREE.Vector3(0, 1.28, 0);
    this.controls.target.copy(focusPoint);

    const fovRad = this.camera.fov * (Math.PI / 180);
    const aspect = this.camera.aspect;

    const distY = (size.y / 2) / Math.tan(fovRad / 2);
    const distX = (size.x / 2) / (Math.tan(fovRad / 2) * aspect);
    let cameraDistance = Math.max(distY, distX);

    // 1.35 margin factor for generous Apple website hero product framing
    const padding = 1.35;
    cameraDistance *= padding;

    // 3/4 perspective hero elevation facing the head and titanium base
    const direction = new THREE.Vector3(0.48, 0.28, 0.82).normalize();
    this.camera.position.copy(focusPoint).add(direction.multiplyScalar(cameraDistance));

    this.camera.updateProjectionMatrix();
    this.controls.update();
  }

  private buildStudioFloor() {
    const planeGeom = new THREE.PlaneGeometry(30, 30);
    planeGeom.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.16 });
    const shadowMesh = new THREE.Mesh(planeGeom, shadowMat);
    shadowMesh.position.y = 0.001;
    shadowMesh.receiveShadow = true;
    this.scene.add(shadowMesh);

    // Realistic blurred contact shadow directly under the weighted base
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 20, 128, 128, 120);
      grad.addColorStop(0, 'rgba(15, 23, 42, 0.45)');
      grad.addColorStop(0.35, 'rgba(15, 23, 42, 0.22)');
      grad.addColorStop(0.75, 'rgba(15, 23, 42, 0.05)');
      grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const contactShadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const contactShadowGeom = new THREE.PlaneGeometry(4.8, 4.8);
    contactShadowGeom.rotateX(-Math.PI / 2);
    const contactShadowMat = new THREE.MeshBasicMaterial({
      map: contactShadowTexture,
      transparent: true,
      depthWrite: false,
    });
    const contactShadowMesh = new THREE.Mesh(contactShadowGeom, contactShadowMat);
    contactShadowMesh.position.y = 0.003;
    this.scene.add(contactShadowMesh);

    // Subtle studio countertop guide ring
    const ring = new THREE.RingGeometry(2.4, 2.42, 64);
    ring.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xCBD5E1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ringMesh = new THREE.Mesh(ring, ringMat);
    ringMesh.position.y = 0.002;
    this.scene.add(ringMesh);
  }

  private onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.cssRenderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate() {
    requestAnimationFrame(this.animate.bind(this));
    const delta = this.clock.getDelta();

    this.controls.update();
    this.soundbox.update(delta);

    // Synchronize CSS3D iframe with the motorized rotating head's exact 3D world transform
    if (this.screenIframeObject) {
      const worldPos = new THREE.Vector3();
      const worldQuat = new THREE.Quaternion();

      this.soundbox.screenGroup.getWorldPosition(worldPos);
      this.soundbox.screenGroup.getWorldQuaternion(worldQuat);

      // Sit cleanly flush on the front face of the unibody casing without clipping
      const forwardOffset = new THREE.Vector3(0, 0, 0.004).applyQuaternion(worldQuat);
      worldPos.add(forwardOffset);

      this.screenIframeObject.position.copy(worldPos);
      this.screenIframeObject.quaternion.copy(worldQuat);
    }

    this.renderer.render(this.scene, this.camera);
    this.cssRenderer.render(this.cssScene, this.camera);
  }
}

// Instantiate on DOM load & expose clean Rotation API on window
window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  (window as unknown as { __app: App }).__app = app;
  (window as unknown as { soundbox: typeof app.soundbox }).soundbox = app.soundbox;

  // Dedicated Rotation API accessible from window.rotationAPI
  const rotationAPI = {
    rotateToCustomer: () => {
      app.soundbox.rotateToCustomer();
      console.log('🔄 Articulating to Customer view (Yaw: 0°, Pitch: -26°)');
    },
    rotateToMerchant: () => {
      app.soundbox.rotateToMerchant();
      console.log('🔄 Articulating to Merchant view (Yaw: 180°, Pitch: -18°)');
    },
    setRotation: (yawDeg: number, pitchDeg?: number) => {
      app.soundbox.setRotationDegrees(yawDeg, pitchDeg);
      console.log(`🔄 Set target rotation to Yaw: ${yawDeg}°, Pitch: ${pitchDeg ?? 'unchanged'}°`);
    },
    toggle: () => {
      app.soundbox.toggleSide();
      console.log('🔄 Toggled between Customer and Merchant');
    },
    enableAutoRotation: (enable: boolean = true) => {
      app.soundbox.isAutoTurning = enable;
      console.log(`🔄 Auto-rotation set to: ${enable}`);
    },
    getRotation: () => app.soundbox.getRotation()
  };

  (window as unknown as { rotationAPI: typeof rotationAPI }).rotationAPI = rotationAPI;

  console.log('%c🤖 Chotu Hardware Rotation API Exposed on window.rotationAPI & window.soundbox', 'color: #00BAF2; font-weight: bold; font-size: 13px;');
  console.log('Available commands:');
  console.log('• window.rotationAPI.rotateToCustomer()');
  console.log('• window.rotationAPI.rotateToMerchant()');
  console.log('• window.rotationAPI.setRotation(yawDeg, pitchDeg)');
  console.log('• window.rotationAPI.toggle()');
  console.log('• window.rotationAPI.enableAutoRotation(true/false)');
  console.log('• window.rotationAPI.getRotation()');
});
