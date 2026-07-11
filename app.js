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
  const storedTheme = localStorage.getItem('zenflow-theme') || 'dark';

  if (storedTheme === 'light') {
    document.body.classList.add('light-theme');
    updateThemeIcon('light');
  }

  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('zenflow-theme', isLight ? 'light' : 'dark');
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
  const storedNotes = localStorage.getItem('nilin-portfolio-project-brief');

  if (storedNotes !== null) {
    notesTextarea.value = storedNotes;
  }

  notesTextarea.addEventListener('input', () => {
    localStorage.setItem('nilin-portfolio-project-brief', notesTextarea.value);
  });
});
