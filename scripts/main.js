let scene, camera, renderer, controls;

function init() {
  // Scene setup
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color("skyblue")); // Use CSS color names
  document.body.appendChild(renderer.domElement);

  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Load the model
  const loader = new THREE.GLTFLoader();
  loader.load(
    "assets/model/scene.gltf", // Path to your .gltf file
    (gltf) => {
      const model = gltf.scene;
      scene.add(model);

      // Adjust model position/scale if needed
      model.scale.set(4, 4, 4);
      model.position.set(0, 0, 0);
    },
    undefined, // Progress callback (optional)
    (error) => {
      console.error("Error loading model:", error);
    }
  );

  // Camera controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Disable rotation around the Z axis
  controls.enableRotate = true; // Enable rotation (X and Y axes)
  controls.enablePan = true; // Enable panning
  controls.enableZoom = false; // Enable zooming
  controls.screenSpacePanning = true; // Pan in screen space
  controls.maxPolarAngle = Math.PI / 4; // Limit vertical rotation (0 to 180 degrees)
  controls.minPolarAngle = 0; // Prevent flipping upside down
  controls.rotateSpeed = 1.0; // Adjust rotation speed

  // Disable Z-axis rotation
  controls.enableDamping = true; // Smooth rotation
  controls.dampingFactor = 0.1; // Damping strength

  // Set initial camera position
  camera.position.set(5, 5, 5);
  controls.update();

  // Handle window resize
  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Required if damping is enabled
  renderer.render(scene, camera);
}

// Start the app
init();
animate();
