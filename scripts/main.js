let scene, camera, renderer, controls;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  camera.position.set(5, 5, 5);
  controls.update();

  const loader = new THREE.GLTFLoader();
  loader.load(
    "assets/model/scene.gltf",
    (gltf) => {
      const model = gltf.scene;
      scene.add(model);

      model.scale.set(2, 2, 2);
      model.position.set(0, 0, 0);
    },
    undefined,
    (error) => {
      console.error("Error loading model:", error);
    }
  );

  window.addEventListener("resize", onWindowResize, false);
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

init();
animate();
