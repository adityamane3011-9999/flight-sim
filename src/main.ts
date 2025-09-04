import * as THREE from 'three';
import Stats from 'stats-js';

// The main class that will encapsulate our entire application
class App {
  // Core Three.js components
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private testCube: THREE.Mesh;
  private stats: Stats;

  constructor() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    document.body.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a2b3c);
    
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    this.testCube = new THREE.Mesh(geometry, material);
    this.scene.add(this.testCube);
    
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(1, 1, 1);
    this.scene.add(light);
    
    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);
    
    window.addEventListener('resize', this.onWindowResize.bind(this));
    
    this.animate();
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    this.stats.begin();
    this.testCube.rotation.x += 0.01;
    this.testCube.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
    this.stats.end();
  }
}

new App();
