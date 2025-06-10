window.addEventListener('DOMContentLoaded', () => {
  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
  );

  // ✅ Tilted camera
  camera.position.set(50, 40, 70);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.domElement.style.display = 'none';

  // ☀️ Bright Point Light
  const light = new THREE.PointLight(0xffffff, 2.5, 1000);
  light.position.set(0, 0, 0);
  scene.add(light);

  // 🌞 Sun
  const sunGeo = new THREE.SphereGeometry(4, 32, 32);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xFDB813 });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  scene.add(sun);

  // 🌟 Stars
  let stars;
  function addStars(count = 1000) {
    const starGeo = new THREE.BufferGeometry();
    const positions = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 1000;
      const y = (Math.random() - 0.5) * 1000;
      const z = (Math.random() - 0.5) * 1000;
      positions.push(x, y, z);
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.2,
      transparent: true,
      opacity: 1,
      depthWrite: false
    });
    stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);
  }

  addStars();

  // 🌀 Orbit Ring Function
  function createOrbitRing(radius) {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false);
    const points = curve.getSpacedPoints(100);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      opacity: 0.3,
      transparent: true
    });
    const ring = new THREE.LineLoop(geometry, material);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
  }

  // 🪐 Planets
  const planets = [
    { name: "mercury", color: 0xaaaaaa, size: 0.5, distance: 10, speed: 0.04 },
    { name: "venus", color: 0xffcc66, size: 0.9, distance: 13, speed: 0.03 },
    { name: "earth", color: 0x3399ff, size: 1.0, distance: 16, speed: 0.02 },
    { name: "mars", color: 0xff3300, size: 0.8, distance: 19, speed: 0.018 },
    { name: "jupiter", color: 0xff9966, size: 2.2, distance: 24, speed: 0.01 },
    { name: "saturn", color: 0xffcc99, size: 1.8, distance: 30, speed: 0.008 },
    { name: "uranus", color: 0x66ccff, size: 1.5, distance: 36, speed: 0.006 },
    { name: "neptune", color: 0x6666ff, size: 1.5, distance: 42, speed: 0.005 },
    { name: "pluto", color: 0xffffff, size: 0.4, distance: 48, speed: 0.004 }
  ];

  planets.forEach(p => {
    const geo = new THREE.SphereGeometry(p.size, 32, 32);
    const mat = new THREE.MeshStandardMaterial({ color: p.color });
    p.mesh = new THREE.Mesh(geo, mat);
    scene.add(p.mesh);
    p.angle = Math.random() * Math.PI * 2;

    // ✅ Orbit Ring for this planet
    createOrbitRing(p.distance);
  });

  // 🎬 Animate
  function animate() {
    requestAnimationFrame(animate);

    planets.forEach(p => {
      const slider = document.getElementById(`${p.name}-slider`);
      if (slider) p.speed = parseFloat(slider.value) / 1000;
      p.angle += p.speed;
      p.mesh.position.set(
        Math.cos(p.angle) * p.distance,
        0,
        Math.sin(p.angle) * p.distance
      );
    });

    if (stars) {
      stars.material.opacity = 0.7 + Math.sin(Date.now() * 0.005) * 0.3;
    }

    renderer.render(scene, camera);
  }

  animate();

  // 🔁 Resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // 🔄 2D / 3D Toggle
  const toggle3D = document.getElementById('toggle3D');
  const container2D = document.querySelector('.container');

  toggle3D.addEventListener('change', (e) => {
    if (e.target.checked) {
      container2D.style.display = 'none';
      renderer.domElement.style.display = 'block';
    } else {
      container2D.style.display = 'flex';
      renderer.domElement.style.display = 'none';
    }
  });
});
