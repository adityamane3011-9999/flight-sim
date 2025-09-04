import * as THREE from 'three';
import { SimplexNoise } from 'simplex-noise';

const TERRAIN_SIZE = 4000;
const TERRAIN_SEGMENTS = 100;
const TERRAIN_HEIGHT = 200;

export class Terrain {
  public mesh: THREE.Mesh;
  private simplex: SimplexNoise;
  private geometry: THREE.PlaneGeometry;

  constructor(scene: THREE.Scene) {
    this.simplex = new SimplexNoise();

    // For this increment, we'll use a single, large plane for the terrain.
    // We'll add the multi-mesh LOD system in a future step.
    this.geometry = new THREE.PlaneGeometry(
      TERRAIN_SIZE,
      TERRAIN_SIZE,
      TERRAIN_SEGMENTS,
      TERRAIN_SEGMENTS
    );
    this.geometry.rotateX(-Math.PI / 2); // Rotate it to be flat

    this.applyNoiseToGeometry();

    const material = new THREE.MeshStandardMaterial({
      color: 0x3c7a47, // A nice green
      flatShading: true, // Gives it a low-poly look
    });

    this.mesh = new THREE.Mesh(this.geometry, material);
    scene.add(this.mesh);
  }

  // This function modifies the vertices of the plane to create mountains
  private applyNoiseToGeometry(): void {
    const positions = this.geometry.attributes.position;

    // Loop through each vertex in the plane
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);

      // Get a noise value. The different frequencies create varied terrain.
      const noise1 = this.simplex.noise2D(x / 1000, z / 1000) * 0.5; // Large features
      const noise2 = this.simplex.noise2D(x / 200, z / 200) * 0.25; // Medium features
      const noise3 = this.simplex.noise2D(x / 50, z / 50) * 0.125; // Small details
      
      const height = (noise1 + noise2 + noise3) * TERRAIN_HEIGHT;

      // Set the vertex's Y position to the calculated height
      positions.setY(i, height);
    }

    // Important: Tell Three.js the vertices have been updated.
    positions.needsUpdate = true;
    this.geometry.computeVertexNormals();
  }

  // This is where our floating origin logic will go.
  public update(playerPosition: THREE.Vector3): void {
    // Center the terrain mesh on the player's XZ position.
    // This makes it seem like the terrain is infinite.
    this.mesh.position.x = playerPosition.x;
    this.mesh.position.z = playerPosition.z;
  }
}
