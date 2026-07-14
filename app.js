/* ==========================================================================
   ZenFlow Logic - Timer, Synthesizers, Todo list, and Aesthetics
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  let audioCtx = null;

  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- Genesis Intro Animation Engine ---
  const animElements = document.querySelectorAll('.genesis-element');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (animElements.length > 0) {
    const genesisPlayed = sessionStorage.getItem('zenflow-genesis-played');
    
    if (genesisPlayed || prefersReducedMotion.matches) {
      // Skip animation, clean up immediately
      cleanUpGenesisInstant();
    } else {
      runGenesisAnimation();
    }
  }

  function cleanUpGenesisInstant() {
    document.documentElement.classList.remove('genesis-loading');
    animElements.forEach(el => {
      if (el) {
        el.style.transform = "";
        el.style.opacity = "";
        el.style.zIndex = "";
      }
    });
  }

  function runGenesisAnimation() {
    let isComplete = false;

    // Safety Fallback Timeout (2.5 seconds)
    const safetyTimeoutId = setTimeout(() => {
      console.warn("Genesis safety fallback triggered.");
      cleanUp();
    }, 2500);

    function cleanUp() {
      if (isComplete) return;
      isComplete = true;
      clearTimeout(safetyTimeoutId);
      
      document.documentElement.classList.remove('genesis-loading');
      animElements.forEach(el => {
        if (el) {
          el.style.transform = "";
          el.style.opacity = "";
          el.style.zIndex = "";
        }
      });
      sessionStorage.setItem('zenflow-genesis-played', 'true');
    }

    // Capture initial layouts after first paint
    const elementsData = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    animElements.forEach((el, index) => {
      if (!el) return;
      
      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;
      
      // Translation needed to center the element
      const dx = centerX - elCenterX;
      const dy = centerY - elCenterY;
      
      // Alternate clockwise/counter-clockwise spins (720 deg = 2 full rotations)
      const dir = index % 2 === 0 ? 1 : -1;
      const startRotation = dir * 720;
      
      elementsData.push({
        el,
        dx,
        dy,
        startRotation,
        zIndex: 100 + index
      });

      // Apply initial state (centered, 45% scale, 0.95 opacity)
      el.style.transform = `translate(${dx}px, ${dy}px) scale(0.45) rotate(${startRotation}deg)`;
      el.style.opacity = "0.95";
      el.style.zIndex = (100 + index).toString();
    });

    // Strip pre-render blocker class so center-spinning elements render
    document.documentElement.classList.remove('genesis-loading');

    // Run custom requestAnimationFrame loop
    const duration = 1800; // 1.8 seconds total (800ms Stage 1, 1000ms Stage 2)
    let startTime = null;

    function animate(timestamp) {
      if (isComplete) return;
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed >= duration) {
        cleanUp();
        return;
      }

      // Timeline Logic
      if (elapsed < 800) {
        // Stage 1: Spin hold at center (0ms - 800ms)
        const p1 = elapsed / 800;
        
        elementsData.forEach(data => {
          const rotation = data.startRotation * (1 - p1 * 0.5); // spin 50% of the way (1 full rotation) to dir * 360deg
          
          data.el.style.transform = `translate(${data.dx}px, ${data.dy}px) scale(0.45) rotate(${rotation}deg)`;
          data.el.style.opacity = "0.95";
        });
      } else {
        // Stage 2: Explode outward (800ms - 1800ms)
        const p2 = (elapsed - 800) / 1000;
        
        // Easing function: Cubic Out (snappy arrival)
        const p_ease = 1 - Math.pow(1 - p2, 3);
        
        elementsData.forEach(data => {
          const currentX = data.dx * (1 - p_ease);
          const currentY = data.dy * (1 - p_ease);
          const scale = 0.45 + 0.55 * p_ease; // scale from 0.45 to 1.0
          const opacity = 0.95 + 0.05 * p_ease; // opacity from 0.95 to 1.0
          
          // Remaining 50% of rotation wound down from dir * 360deg to 0deg
          const midRotation = data.startRotation * 0.5;
          const rotation = midRotation * (1 - p_ease);
          
          data.el.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale}) rotate(${rotation}deg)`;
          data.el.style.opacity = opacity.toString();
        });
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  // --- Theme Toggle Setup ---
  const themeToggleBtn = document.getElementById('theme-toggle');

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      updateThemeIcon(isLight ? 'light' : 'dark');
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
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
    if (headerDate) {
      headerDate.textContent = now.toLocaleDateString('en-US', options);
    }

    // Time formatting: 18:30
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    if (headerTime) {
      headerTime.textContent = timeString;
    }

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

    if (greetingTitle) {
      greetingTitle.textContent = `${greeting}, I'm Nilin Chitrakar`;
    }
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
    if (!clientName || !nameFeedback) return false;
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
    if (!clientEmail || !emailFeedback) return false;
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
    if (todoCounter) {
      todoCounter.textContent = `${completed} / ${total}`;
    }
  }

  function renderTasks() {
    if (!todoList) return;
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
      const checkbox = li.querySelector('.todo-checkbox');
      const deleteBtn = li.querySelector('.todo-delete-btn');
      if (checkbox) checkbox.addEventListener('click', () => toggleTask(task.id));
      if (deleteBtn) deleteBtn.addEventListener('click', () => deleteTask(task.id));
      
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

  if (todoForm && todoInput) {
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
  }

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

    const termContainer = document.getElementById('teleport-terminal');
    const termLines = document.getElementById('teleport-terminal-lines');
    const hackCanvas = document.getElementById('hacking-canvas');
    const lockContainer = document.getElementById('hack-lock-container');
    const lockRing = document.getElementById('lock-ring');
    const lockShackle = document.getElementById('lock-shackle');
    const hexDumpEl = document.getElementById('hack-hex-dump');
    const pingEl = document.getElementById('hack-ping');
    const cpuEl = document.getElementById('hack-cpu');

    const triggers = document.querySelectorAll(selector);
    console.log('[Teleport Debug] found triggers count:', triggers.length);
    triggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        console.log('[Teleport Debug] Click detected on:', trigger);
        e.preventDefault();

        // Initialize Web Audio Context lazily on user gesture
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        
        const targetUrl = trigger.getAttribute('href');
        if (!targetUrl) return;

        const style = trigger.getAttribute('data-teleport-style') || 'vortex';

        // Determine destination URL with teleport parameter
        const urlObj = new URL(targetUrl, window.location.origin);
        urlObj.searchParams.set('teleport', '1');
        const finalUrl = urlObj.toString();

        let animationFrameId = null;
        let hackAnimationFrameId = null;
        let safetyTimeoutId = null;
        let isTransitioned = false;
        let isTabVisible = true;
        const typingIntervals = [];

        // Audio node tracking for cleanup
        let droneOsc = null;
        let droneGain = null;

        // Audio keystroke/alert synthesizer helper
        function playKeySound(freq = 800, duration = 0.03, type = 'sine') {
          if (!audioCtx) return;
          try {
            if (audioCtx.state === 'suspended') return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
          } catch(err) {
            console.log('Audio keypress synth failed:', err);
          }
        }

        // Tab focus Visibility API handler
        const handleVisibilityChange = () => {
          isTabVisible = !document.hidden;
          if (isTabVisible && !isTransitioned && style === 'hacking') {
            hackMatrixLoop();
          }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Navigation trigger helper
        function completeTransition() {
          if (isTransitioned) return;
          isTransitioned = true;
          
          document.removeEventListener('visibilitychange', handleVisibilityChange);

          // Clear animation loops, timeouts and typing intervals
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          if (hackAnimationFrameId) cancelAnimationFrame(hackAnimationFrameId);
          if (safetyTimeoutId) clearTimeout(safetyTimeoutId);
          typingIntervals.forEach(id => {
            clearTimeout(id);
            clearInterval(id);
          });

          // Smoothly ramp down tension hum drone to prevent pop clicks
          if (droneGain && audioCtx) {
            try {
              droneGain.gain.cancelScheduledValues(audioCtx.currentTime);
              droneGain.gain.setValueAtTime(droneGain.gain.value, audioCtx.currentTime);
              droneGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
            } catch(err) {
              console.log('Drone fadeout failed:', err);
            }
          }
          
          // Open target in a new tab
          window.open(finalUrl, '_blank');

          // Fade out whichever overlay is active
          if (style === 'hacking') {
            if (termContainer) {
              termContainer.classList.remove('opacity-100', 'flash-white');
              setTimeout(() => {
                termContainer.classList.add('hidden');
                termContainer.classList.remove('flex');
                if (termLines) termLines.innerHTML = '';
                if (hexDumpEl) hexDumpEl.innerHTML = '';
                if (lockShackle) lockShackle.style.transform = "";
                if (lockContainer) {
                  lockContainer.classList.remove('opacity-100', 'scale-100');
                  lockContainer.classList.add('opacity-0', 'scale-90');
                }
                if (lockRing) lockRing.style.strokeDashoffset = "276";
              }, 300);
            }
          } else {
            canvas.classList.remove('active');
            const ctx = canvas.getContext('2d');
            setTimeout(() => {
              if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
            }, 400); // match CSS transition duration
          }
        }

        // Set up safety timeouts and reduced motion checks (3100ms run + 800ms buffer = 3900ms)
        const fallbackDuration = style === 'hacking' ? 3900 : 1500;
        safetyTimeoutId = setTimeout(() => {
          console.warn('Teleport animation fallback triggered.');
          completeTransition();
        }, fallbackDuration);

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
          // Simple short fade overlay instead of loops/typewriters
          if (style === 'hacking') {
            if (termContainer) {
              termLines.innerHTML = '';
              termContainer.classList.remove('hidden');
              termContainer.classList.add('flex', 'opacity-100');
            }
          } else {
            canvas.classList.add('active');
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = '#080707';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
          }
          setTimeout(completeTransition, 350);
          return;
        }

        // Style selector branch
        if (style === 'hacking') {
          if (termContainer && termLines) {
            termLines.innerHTML = '';
            if (hexDumpEl) hexDumpEl.innerHTML = '';
            if (lockShackle) lockShackle.style.transform = "";
            if (lockRing) lockRing.style.strokeDashoffset = "276";
            
            termContainer.classList.remove('hidden');
            termContainer.offsetHeight; // Force reflow
            termContainer.classList.add('flex', 'opacity-100');

            // 1. Initialize Tension rising sound drone (100Hz -> 320Hz sawtooth sweep)
            if (audioCtx && audioCtx.state !== 'suspended') {
              try {
                droneOsc = audioCtx.createOscillator();
                droneGain = audioCtx.createGain();
                const droneFilter = audioCtx.createBiquadFilter();

                droneOsc.type = 'sawtooth';
                droneOsc.frequency.setValueAtTime(100, audioCtx.currentTime);
                // click-free linear frequency ramping
                droneOsc.frequency.linearRampToValueAtTime(320, audioCtx.currentTime + 3.0);

                droneFilter.type = 'lowpass';
                droneFilter.frequency.setValueAtTime(300, audioCtx.currentTime);

                droneGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
                droneGain.gain.exponentialRampToValueAtTime(0.05, audioCtx.currentTime + 0.8);

                droneOsc.connect(droneFilter);
                droneFilter.connect(droneGain);
                droneGain.connect(audioCtx.destination);

                droneOsc.start();
                droneOsc.stop(audioCtx.currentTime + 3.3);
              } catch(err) {
                console.log('Drone synthesis failed:', err);
              }
            }

            // 2. Scrolling Hex Traffic Dump Generator
            const hexChars = '0123456789ABCDEF';
            const generateHexLine = () => {
              let addr = '0x00' + Array.from({length: 6}, () => hexChars[Math.floor(Math.random() * 16)]).join('');
              let bytes = Array.from({length: 16}, () => Array.from({length: 2}, () => hexChars[Math.floor(Math.random() * 16)]).join('')).join(' ');
              const mid = Math.floor(bytes.length / 2);
              const formattedBytes = bytes.slice(0, mid) + ' ' + bytes.slice(mid);
              return `${addr}  ${formattedBytes}`;
            };
            const hexIntervalId = setInterval(() => {
              if (hexDumpEl) {
                const div = document.createElement('div');
                div.textContent = generateHexLine();
                hexDumpEl.appendChild(div);
                while (hexDumpEl.children.length > 15) {
                  hexDumpEl.removeChild(hexDumpEl.firstChild);
                }
              }
            }, 80);
            typingIntervals.push(hexIntervalId);

            // 3. Stats fluctuation logs (Ping & CPU Load)
            const statsIntervalId = setInterval(() => {
              if (pingEl) pingEl.textContent = Math.floor(12 + Math.random() * 86) + 'ms';
              if (cpuEl) cpuEl.textContent = (85.4 + Math.random() * 13.8).toFixed(1) + '%';
            }, 150);
            typingIntervals.push(statsIntervalId);

            // 4. Background Matrix Digital Rain Animation Loop
            if (hackCanvas) {
              const hackCtx = hackCanvas.getContext('2d');
              if (hackCtx) {
                const matrixChars = '01XYZ[]+-*#ØÆ?!<>'.split('');
                const fontSize = 10;
                let columns = 0;
                let drops = [];

                function initHackMatrix() {
                  hackCanvas.width = window.innerWidth;
                  hackCanvas.height = window.innerHeight;
                  columns = Math.floor(hackCanvas.width / fontSize);
                  drops = [];
                  for (let x = 0; x < columns; x++) {
                    drops[x] = Math.random() * -100;
                  }
                }

                function drawHackMatrix() {
                  hackCtx.fillStyle = 'rgba(5, 5, 8, 0.12)';
                  hackCtx.fillRect(0, 0, hackCanvas.width, hackCanvas.height);
                  
                  hackCtx.fillStyle = 'rgba(16, 185, 129, 0.08)';
                  hackCtx.font = fontSize + 'px monospace';
                  
                  for (let i = 0; i < drops.length; i++) {
                    const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                    const xCoord = i * fontSize;
                    const yCoord = drops[i] * fontSize;
                    hackCtx.fillText(text, xCoord, yCoord);
                    
                    if (yCoord > hackCanvas.height && Math.random() > 0.975) {
                      drops[i] = 0;
                    }
                    drops[i]++;
                  }
                }

                window.addEventListener('resize', initHackMatrix);
                initHackMatrix();

                function hackMatrixLoop() {
                  if (isTransitioned || !isTabVisible) return;
                  drawHackMatrix();
                  hackAnimationFrameId = requestAnimationFrame(hackMatrixLoop);
                }

                hackMatrixLoop();
                
                const originalCompleteTransition = completeTransition;
                completeTransition = () => {
                  window.removeEventListener('resize', initHackMatrix);
                  originalCompleteTransition();
                };
              }
            }

            // 5. Typewriter breach timeline functions
            const appendLine = (text, delay, colorClass = 'text-emerald-500') => {
              const timeoutId = setTimeout(() => {
                const p = document.createElement('p');
                p.className = colorClass;
                p.textContent = text;
                termLines.appendChild(p);
                // play line complete confirmation beep
                playKeySound(1500, 0.05, 'sine');
              }, delay);
              typingIntervals.push(timeoutId);
            };

            const typeAccessCode = (delay) => {
              const timeoutId = setTimeout(() => {
                // Show padlock centerpiece
                if (lockContainer) {
                  lockContainer.classList.remove('opacity-0', 'scale-90');
                  lockContainer.classList.add('opacity-100', 'scale-100');
                }

                const p = document.createElement('p');
                p.className = 'text-emerald-500';
                p.textContent = 'ENTER ACCESS CODE: ';
                termLines.appendChild(p);

                let asterisks = 0;
                const maxAsterisks = 14;
                const charInterval = setInterval(() => {
                  if (asterisks < maxAsterisks) {
                    p.textContent += '*';
                    asterisks++;
                    playKeySound(1000, 0.02, 'triangle');
                    
                    // Update padlock Segmented Ring progress
                    if (lockRing) {
                      const offset = 276 * (1 - asterisks / maxAsterisks);
                      lockRing.style.strokeDashoffset = offset.toString();
                    }
                  } else {
                    clearInterval(charInterval);
                    
                    // Code completed: Spring padlock open
                    setTimeout(() => {
                      if (lockShackle) {
                        lockShackle.style.transform = "translate(3px, -4px) rotate(-35deg)";
                      }
                      // Double unlock confirmation chime
                      playKeySound(1200, 0.12, 'sine');
                      setTimeout(() => playKeySound(1800, 0.25, 'sine'), 80);
                      
                      // Full screen white glow pulse
                      if (termContainer) {
                        termContainer.classList.add('flash-white');
                        setTimeout(() => {
                          if (termContainer) termContainer.classList.remove('flash-white');
                        }, 200);
                      }
                    }, 120);
                  }
                }, 40);
                typingIntervals.push(charInterval);
              }, delay);
              typingIntervals.push(timeoutId);
            };

            // Cinematic script sequence scheduling (3.1 seconds total)
            appendLine("INITIATING BREACH PROTOCOL...", 0);
            appendLine("SCANNING TARGET NODE: NEXUS_MAINFRAME...", 250);
            appendLine("BYPASSING FIREWALL LAYER 1... [OK]", 550);
            appendLine("BYPASSING FIREWALL LAYER 2... [OK]", 800);
            appendLine("BYPASSING FIREWALL LAYER 3... [OK]", 1050);
            appendLine("ROUTING THROUGH PROXY CHAIN... [3/3 NODES SECURED]", 1300);
            typeAccessCode(1600); // Types asterisks 1600ms - 2160ms, springs open lock
            appendLine("ACCESS GRANTED.", 2300, 'text-emerald-400 font-bold');
            appendLine("DECRYPTING NEON_NEXUS MAINFRAME...", 2550);
            appendLine("CONNECTION ESTABLISHED.", 2800);

            const completeTimeoutId = setTimeout(() => {
              completeTransition();
            }, 3100);
            typingIntervals.push(completeTimeoutId);
          } else {
            completeTransition();
          }
        } else {
          // Normal Particle Vortex Animation (Galli Cafe or default)
          canvas.classList.add('active');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const particles = [];
            const particleCount = 120;

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
            const duration = 1000;

            function animate(timestamp) {
              if (isTransitioned) return;
              if (!startTime) startTime = timestamp;
              const progress = timestamp - startTime;

              ctx.fillStyle = 'rgba(8, 7, 7, 0.25)';
              ctx.fillRect(0, 0, canvas.width, canvas.height);

              particles.forEach(p => {
                p.radius -= p.speed * (progress / 150 + 1.2);
                p.angle += 0.05 + (p.speed * 0.005);
                
                const x = centerX + Math.cos(p.angle) * p.radius;
                const y = centerY + Math.sin(p.angle) * p.radius;

                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(x, y, p.size, 0, Math.PI * 2);
                ctx.fill();

                if (p.radius < 5) {
                  p.radius = Math.max(canvas.width, canvas.height) * 0.8;
                }
              });

              if (progress < duration) {
                animationFrameId = requestAnimationFrame(animate);
              } else {
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
            
            const originalCompleteTransition = completeTransition;
            completeTransition = () => {
              window.removeEventListener('resize', resizeHandler);
              originalCompleteTransition();
            };

            animationFrameId = requestAnimationFrame(animate);
          } else {
            completeTransition();
          }
        }
      });
    });
  }

  // Bind triggers
  initTeleportTransition('.teleport-trigger');
});
