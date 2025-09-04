import * as THREE from 'three';
import Stats from 'stats-js';
import { InputManager } from '../input/InputManager.ts';
import { HUD } from '../ui/HUD.ts';
import { Terrain } from '../world/Terrain.ts'; // Import the new Terrain class

const FIXED_TIMESTEP = 1 / 60;
const MAX_FRAME_TIME = 0.25;

export class App {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private stats: Stats;
  private inputManager: InputManager;
  private hud: HUD;

  // New components
  private terrain: Terrain;
  private playerPosition: THREE.Vector3;
  private playerVelocity: THREE.Vector3;

  private lastTime: number = 0;
  private accumulator: number = 0;

  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    document.body.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb); // A sky blue color

    // Add Fog
    this.scene.fog = new THREE.Fog(0x87ceeb, 1, 2000);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 100, 100);
    this.scene.add(directionalLight);
    
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
    
    this.inputManager = new InputManager();
    this.hud = new HUD();

    // Initialize the new terrain and player
    this.terrain = new Terrain(this.scene);
    this.playerPosition = new THREE.Vector3(0, 100, 0); // Start 100m up
    this.playerVelocity = new THREE.Vector3(0, 0, 0);

    window.addEventListener('resize', this.onWindowResize.bind(this));
    
    this.update(0);
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  private update(currentTime: number): void {
    requestAnimationFrame(this.update.bind(this));
    const deltaTime = Math.min((currentTime - this.lastTime) * 0.001, MAX_FRAME_TIME);
    this.lastTime = currentTime;
    this.accumulator += deltaTime;

    while (this.accumulator >= FIXED_TIMESTEP) {
      this.updatePhysics(FIXED_TIMESTEP);
      this.accumulator -= FIXED_TIMESTEP;
    }

    this.render();
    this.stats.update();
  }

  private updatePhysics(timestep: number): void {
    const moveSpeed = 100; // meters per second
    
    // Simple player movement
    if (this.inputManager.isKeyPressed('w')) {
      this.playerVelocity.z = -moveSpeed;
    } else if (this.inputManager.isKeyPressed('s')) {
      this.playerVelocity.z = moveSpeed;
    } else {
      this.playerVelocity.z = 0;
    }

    if (this.inputManager.isKeyPressed('a')) {
      this.playerVelocity.x = -moveSpeed;
    } else if (this.inputManager.isKeyPressed('d')) {
      this.playerVelocity.x = moveSpeed;
    } else {
      this.playerVelocity.x = 0;
    }

    this.playerPosition.x += this.playerVelocity.x * timestep;
    this.playerPosition.z += this.playerVelocity.z * timestep;

    // Update the terrain based on the player's new position
    this.terrain.update(this.playerPosition);
  }

  private render(): void {
    // Simple chase camera
    this.camera.position.x = this.playerPosition.x;
    this.camera.position.y = this.playerPosition.y + 50; // Camera is 50m above player
    this.camera.position.z = this.playerPosition.z + 100; // And 100m behind
    this.camera.lookAt(this.playerPosition);

    this.renderer.render(this.scene, this.camera);
    
    this.hud.update(
      `Position:
      X: ${this.playerPosition.x.toFixed(2)}
      Y: ${this.playerPosition.y.toFixed(2)}
      Z: ${this.playerPosition.z.toFixed(2)}`
    );
  }
}
