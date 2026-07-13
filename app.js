/* ==========================================================================
   ZenFlow Logic - Timer, Synthesizers, Todo list, and Aesthetics
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- Theme Toggle Setup ---
  const themeToggleBtn = document.getElementById('theme-toggle');

  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    updateThemeIcon(isLight ? 'light' : 'dark');
  });

  function updateThemeIcon(theme) {
    const icon = themeToggleBtn.querySelector('i');
    if (icon) {
      if (theme === 'light') {
        icon.setAttribute('data-lucide', 'sun');
      } else {
        icon.setAttribute('data-lucide', 'moon');
      }
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }
  }

  // --- Dynamic DateTime & Greeting ---
  const headerDate = document.getElementById('header-date');
  const headerTime = document.getElementById('header-time');
  const greetingTitle = document.getElementById('greeting-title');

  function updateDateTimeAndGreeting() {
    const now = new Date();
    
    // Date formatting: Wednesday, July 8
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    headerDate.textContent = now.toLocaleDateString('en-US', options);

    // Time formatting: 18:30
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    headerTime.textContent = timeString;

    // Dynamic greeting based on hour
    const hours = now.getHours();
    let greeting = 'Good evening';
    let subtitle = "Handcrafting clean HTML, CSS, and Tailwind layouts. Let's build something exceptional.";

    if (hours < 12) {
      greeting = 'Good morning';
      subtitle = 'Start your day with high-performance web solutions. Ready to discuss your project?';
    } else if (hours < 17) {
      greeting = 'Good afternoon';
      subtitle = "Designing sleek, speed-optimized user interfaces. Let's grow your brand online.";
    } else {
      greeting = 'Good evening';
      subtitle = "Handcrafting clean HTML, CSS, and Tailwind layouts. Let's build something exceptional.";
    }

    greetingTitle.textContent = `${greeting}, I'm Nilin Chitrakar`;
    const subtitleEl = document.getElementById('greeting-subtitle');
    if (subtitleEl) subtitleEl.textContent = subtitle;
  }

  updateDateTimeAndGreeting();
  setInterval(updateDateTimeAndGreeting, 1000 * 60); // update every minute

  // --- Contact Form Real-time Validation ---
  const contactForm = document.getElementById('contact-form');
  const clientName = document.getElementById('client-name');
  const clientEmail = document.getElementById('client-email');
  const clientMessage = document.getElementById('client-message');
  const nameFeedback = document.getElementById('name-validation-feedback');
  const emailFeedback = document.getElementById('email-validation-feedback');
  const messageCharCount = document.getElementById('message-char-count');
  
  const formContainer = document.getElementById('contact-form-container');
  const successContainer = document.getElementById('contact-success-container');
  const resetFormBtn = document.getElementById('reset-form-btn');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateName() {
    const val = clientName.value.trim();
    if (val.length >= 2) {
      nameFeedback.classList.add('hidden');
      clientName.classList.remove('border-red-500', 'focus:ring-red-500');
      clientName.classList.add('border-emerald-500', 'focus:ring-emerald-500');
      return true;
    } else {
      if (val.length > 0) {
        nameFeedback.classList.remove('hidden');
        clientName.classList.add('border-red-500', 'focus:ring-red-500');
        clientName.classList.remove('border-emerald-500', 'focus:ring-emerald-500');
      } else {
        nameFeedback.classList.add('hidden');
        clientName.classList.remove('border-red-500', 'focus:ring-red-500', 'border-emerald-500', 'focus:ring-emerald-500');
      }
      return false;
    }
  }

  function validateEmail() {
    const val = clientEmail.value.trim();
    if (emailRegex.test(val)) {
      emailFeedback.classList.add('hidden');
      clientEmail.classList.remove('border-red-500', 'focus:ring-red-500');
      clientEmail.classList.add('border-emerald-500', 'focus:ring-emerald-500');
      return true;
    } else {
      if (val.length > 0) {
        emailFeedback.classList.remove('hidden');
        clientEmail.classList.add('border-red-500', 'focus:ring-red-500');
        clientEmail.classList.remove('border-emerald-500', 'focus:ring-emerald-500');
      } else {
        emailFeedback.classList.add('hidden');
        clientEmail.classList.remove('border-red-500', 'focus:ring-red-500', 'border-emerald-500', 'focus:ring-emerald-500');
      }
      return false;
    }
  }

  if (clientName) {
    clientName.addEventListener('input', validateName);
  }

  if (clientEmail) {
    clientEmail.addEventListener('input', validateEmail);
  }

  if (clientMessage) {
    clientMessage.addEventListener('input', () => {
      const count = clientMessage.value.length;
      messageCharCount.textContent = `${count} / 500`;
      if (count >= 450) {
        messageCharCount.classList.add('text-amber-500');
      } else {
        messageCharCount.classList.remove('text-amber-500');
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const isNameValid = validateName();
      const isEmailValid = validateEmail();

      if (isNameValid && isEmailValid) {
        // Cache locally for static site feedback persistence
        const brief = {
          name: clientName.value.trim(),
          email: clientEmail.value.trim(),
          message: clientMessage.value.trim(),
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('nilin-last-contact-brief', JSON.stringify(brief));

        // Toggle visual states
        formContainer.classList.add('hidden');
        successContainer.classList.remove('hidden');
      }
    });
  }

  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
      contactForm.reset();
      messageCharCount.textContent = '0 / 500';
      clientName.classList.remove('border-emerald-500', 'focus:ring-emerald-500', 'border-red-500', 'focus:ring-red-500');
      clientEmail.classList.remove('border-emerald-500', 'focus:ring-emerald-500', 'border-red-500', 'focus:ring-red-500');
      successContainer.classList.add('hidden');
      formContainer.classList.remove('hidden');
    });
  }



  // --- Task Manager (Todo List) ---
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');
  const todoCounter = document.getElementById('todo-counter');

  let tasks = JSON.parse(localStorage.getItem('nilin-portfolio-roadmap')) || [
    { id: 1, text: 'Design custom portfolio layout and visual elements', completed: true },
    { id: 2, text: 'Configure Tailwind CSS build process and variables', completed: true },
    { id: 3, text: 'Integrate interactive Web Audio demo frequencies', completed: true },
    { id: 4, text: 'Deploy optimized speed files on live domain name', completed: false }
  ];

  function saveTasks() {
    localStorage.setItem('nilin-portfolio-roadmap', JSON.stringify(tasks));
    updateTodoCounter();
  }

  function updateTodoCounter() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    todoCounter.textContent = `${completed} / ${total}`;
  }

  function renderTasks() {
    todoList.innerHTML = '';
    
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `todo-item ${task.completed ? 'completed' : ''}`;
      li.dataset.id = task.id;

      li.innerHTML = `
        <div class="todo-left">
          <div class="todo-checkbox ${task.completed ? 'checked' : ''}" aria-label="Toggle Complete">
            ${task.completed ? '<i data-lucide="check"></i>' : ''}
          </div>
          <span class="todo-text">${escapeHTML(task.text)}</span>
        </div>
        <button class="todo-delete-btn" aria-label="Delete Task">
          <i data-lucide="trash-2"></i>
        </button>
      `;

      // Event Listeners for Item Actions
      li.querySelector('.todo-checkbox').addEventListener('click', () => toggleTask(task.id));
      li.querySelector('.todo-delete-btn').addEventListener('click', () => deleteTask(task.id));
      
      todoList.appendChild(li);
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    updateTodoCounter();
  }

  function toggleTask(id) {
    tasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    saveTasks();
    renderTasks();
  }

  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
  }

  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (!text) return;

    const newTask = {
      id: Date.now(),
      text: text,
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    todoInput.value = '';
  });

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // Initialize Todos
  renderTasks();


  // --- Quick Notes Auto-save ---
  const notesTextarea = document.getElementById('quick-notes');
  if (notesTextarea) {
    const storedNotes = localStorage.getItem('nilin-portfolio-project-brief');

    if (storedNotes !== null) {
      notesTextarea.value = storedNotes;
    }

    notesTextarea.addEventListener('input', () => {
      localStorage.setItem('nilin-portfolio-project-brief', notesTextarea.value);
    });
  }

  // --- Reusable Teleport Transition Component ---
  function initTeleportTransition(selector) {
    console.log('[Teleport Debug] initTeleportTransition called with:', selector);
    const canvas = document.getElementById('teleport-canvas');
    if (!canvas) {
      console.error('[Teleport Debug] canvas not found!');
      return;
    }

    const triggers = document.querySelectorAll(selector);
    console.log('[Teleport Debug] found triggers count:', triggers.length);
    triggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        console.log('[Teleport Debug] Click detected on:', trigger);
        e.preventDefault();
        
        const targetUrl = trigger.getAttribute('href');
        if (!targetUrl) return;

        // Determine destination URL with teleport parameter
        const urlObj = new URL(targetUrl, window.location.origin);
        urlObj.searchParams.set('teleport', '1');
        const finalUrl = urlObj.toString();

        // Canvas Setup
        canvas.classList.add('active');
        const ctx = canvas.getContext('2d');
        let animationFrameId = null;
        let safetyTimeoutId = null;
        let isTransitioned = false;

        // Navigation trigger helper
        function completeTransition() {
          if (isTransitioned) return;
          isTransitioned = true;
          
          // Clear animation loops and safeties
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          if (safetyTimeoutId) clearTimeout(safetyTimeoutId);
          
          // Open target in a new tab
          window.open(finalUrl, '_blank');

          // Fade out the overlay to restore page interaction
          canvas.classList.remove('active');
          setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }, 400); // match CSS transition duration
        }

        // 1. Safety Navigation Fallback (1.5 seconds)
        safetyTimeoutId = setTimeout(() => {
          console.warn('Teleport animation fallback triggered.');
          completeTransition();
        }, 1500);

        // 2. Prefers-Reduced-Motion check
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
          // Simple short fade-to-black instead of particle simulation
          ctx.fillStyle = '#080707';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Wait briefly, open, and fade out
          setTimeout(completeTransition, 350);
          return;
        }

        // 3. Normal Particle Vortex Animation
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const particles = [];
        const particleCount = 120;

        // Initialize particles starting at radial bounds
        for (let i = 0; i < particleCount; i++) {
          particles.push({
            angle: Math.random() * Math.PI * 2,
            radius: Math.random() * Math.max(canvas.width, canvas.height) * 0.8,
            speed: 2 + Math.random() * 3,
            size: 1.5 + Math.random() * 2,
            color: `rgba(${139 + Math.random() * 50}, ${92 + Math.random() * 50}, 246, ${0.4 + Math.random() * 0.6})`
          });
        }

        let startTime = null;
        const duration = 1000; // Animation duration (1s)

        function animate(timestamp) {
          if (!startTime) startTime = timestamp;
          const progress = timestamp - startTime;

          // Semi-transparent overlay to draw smooth particle trail sweeps
          ctx.fillStyle = 'rgba(8, 7, 7, 0.25)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Update and draw particles
          particles.forEach(p => {
            p.radius -= p.speed * (progress / 150 + 1.2);
            p.angle += 0.05 + (p.speed * 0.005);
            
            const x = centerX + Math.cos(p.angle) * p.radius;
            const y = centerY + Math.sin(p.angle) * p.radius;

            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(x, y, p.size, 0, Math.PI * 2);
            ctx.fill();

            // Respawn particles at the outer rim if they collapse in
            if (p.radius < 5) {
              p.radius = Math.max(canvas.width, canvas.height) * 0.8;
            }
          });

          if (progress < duration) {
            animationFrameId = requestAnimationFrame(animate);
          } else {
            // Draw a solid black overlay cover and finalize
            ctx.fillStyle = 'rgba(8, 7, 7, 1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            completeTransition();
          }
        }

        // Bind resize handlers during transition to ensure fullscreen alignment
        const resizeHandler = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resizeHandler);
        
        // Remove resize listener upon transition resolution
        const originalCompleteTransition = completeTransition;
        completeTransition = () => {
          window.removeEventListener('resize', resizeHandler);
          originalCompleteTransition();
        };

        animationFrameId = requestAnimationFrame(animate);
      });
    });
  }

  // Bind triggers
  initTeleportTransition('.teleport-trigger');
});
