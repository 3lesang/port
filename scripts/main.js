let scene, camera, renderer, controls, raycaster, mouse, model, mixer, sound;

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
  renderer.setClearColor(new THREE.Color("skyblue"));
  document.body.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  const loader = new THREE.GLTFLoader();
  loader.load(
    "assets/model/scene.gltf",
    function (gltf) {
      model = gltf.scene;
      model.scale.set(1, 1, 1);
      model.position.set(0, 0, 0);
      scene.add(model);

      mixer = new THREE.AnimationMixer(model);
      mixer.clipAction(gltf.animations[0]).play();
    },
    undefined,
    function (error) {
      console.error("Error loading model:", error);
    }
  );

  const listener = new THREE.AudioListener();
  camera.add(listener);

  sound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();

  const loadAudio = () => {
    return new Promise((resolve, reject) => {
      audioLoader.load(
        "assets/dreamy-lofi-background-268725.mp3",
        (buffer) => {
          sound.setBuffer(buffer);
          sound.setLoop(true);
          sound.setVolume(0.5);
          resolve();
        },
        undefined,
        (error) => reject(error)
      );
    });
  };

  const handleAudioPlay = async () => {
    try {
      await loadAudio();

      const playAudio = () => {
        sound.play().catch((error) => {
          console.log("Audio play failed, waiting for user interaction...");
          const playOnInteraction = () => {
            sound.play();
            document.removeEventListener("click", playOnInteraction);
            document.removeEventListener("keydown", playOnInteraction);
          };

          document.addEventListener("click", playOnInteraction);
          document.addEventListener("keydown", playOnInteraction);
        });
      };

      playAudio();
    } catch (error) {
      console.error("Error loading audio:", error);
    }
  };

  handleAudioPlay();

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.maxPolarAngle = Math.PI / 3;
  controls.rotateSpeed = 1.0;
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  camera.position.set(5, 5, 5);
  controls.update();

  window.addEventListener("mousemove", onMouseMove, false);
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
  if (mixer) mixer.update(0.01);
  renderer.render(scene, camera);
}

init();
animate();
