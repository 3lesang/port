let scene, camera, renderer, controls, raycaster, mouse, model;

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
  renderer.setClearColor(new THREE.Color("skyblue"));
  document.body.appendChild(renderer.domElement);

  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Initialize Raycaster & Mouse
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Load the model
  const loader = new THREE.GLTFLoader();
  loader.load(
    "assets/model/scene.gltf",
    function (gltf) {
      model = gltf.scene;
      model.scale.set(4, 4, 4);
      model.position.set(0, 0, 0);
      scene.add(model);
    },
    undefined,
    function (error) {
      console.error("Error loading model:", error);
    }
  );

  // Camera controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableRotate = true;
  controls.enablePan = true;
  controls.enableZoom = false;
  controls.screenSpacePanning = true;
  controls.maxPolarAngle = Math.PI / 4;
  controls.minPolarAngle = 0;
  controls.rotateSpeed = 1.0;
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  // Set initial camera position
  camera.position.set(5, 5, 5);
  controls.update();

  // Handle mouse move event for hover effect
  window.addEventListener("mousemove", onMouseMove, false);

  // Handle window resize
  window.addEventListener("resize", onWindowResize, false);
}

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  if (model) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(model, true);
    document.body.style.cursor = intersects.length > 0 ? "pointer" : "default";
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// Start the app
init();
animate();
