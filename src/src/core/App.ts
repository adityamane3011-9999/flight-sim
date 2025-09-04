import * as THREE from 'three';
import Stats from 'stats-js';
import { InputManager } from '../input/InputManager';
import { HUD } from '../ui/HUD';

// Constants for our game loop
const FIXED_TIMESTEP = 1 / 60; // 60 updates per second
const MAX_FRAME_TIME = 0.25;   // Max time a single frame can take

export class App {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private testCube: THREE.Mesh;
  private stats: Stats;
  
  // New components
  private inputManager: InputManager;
  private hud: HUD;

  // Game loop variables
  private lastTime: number = 0;
  private accumulator: number = 0;

  constructor() {  
    console.log("App constructor started");
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
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
    document.body.appendChild(this.stats.dom);
    
    // Initialize new components
    this.inputManager = new InputManager();
    this.hud = new HUD();

    window.addEventListener('resize', this.onWindowResize.bind(this));
    
    // Start the new game loop
    this.update(0);
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  // The main game loop
  private update(currentTime: number): void {
    requestAnimationFrame(this.update.bind(this));

    // Calculate delta time (time since last frame)
    const deltaTime = Math.min((currentTime - this.lastTime) * 0.001, MAX_FRAME_TIME);
    this.lastTime = currentTime;

    // Add time to the accumulator
    this.accumulator += deltaTime;

    // Process fixed updates as many times as needed
    while (this.accumulator >= FIXED_TIMESTEP) {
      this.updatePhysics(FIXED_TIMESTEP);
      this.accumulator -= FIXED_TIMESTEP;
    }

    // Render the scene
    this.render();
    this.stats.update();
  }

  // Physics and game logic updates go here
  private updatePhysics(timestep: number): void {
    // Simple example: Rotate cube based on input
    if (this.inputManager.isKeyPressed('a')) {
      this.testCube.rotation.y += 2 * timestep;
    }
    if (this.inputManager.isKeyPressed('d')) {
      this.testCube.rotation.y -= 2 * timestep;
    }
    this.testCube.rotation.x += 0.5 * timestep;
  }

  // Rendering updates go here
  private render(): void {
    this.renderer.render(this.scene, this.camera);
    
    // Update the HUD with debug information
    const keyA = this.inputManager.isKeyPressed('a') ? 'PRESSED' : 'RELEASED';
    const keyD = this.inputManager.isKeyPressed('d') ? 'PRESSED' : 'RELEASED';
    this.hud.update(`Key A: ${keyA}\nKey D: ${keyD}`);
  }
}
