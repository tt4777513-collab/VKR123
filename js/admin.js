// Admin Panel JavaScript

// ========== AUTHENTICATION CHECK ==========
// Check if user is logged in when admin panel loads
function checkUserAuthentication() {
  const userSession = localStorage.getItem('userSession');
  
  // If no session, redirect to login page
  if (!userSession) {
    alert('Пожалуйста, войдите в систему для доступа к администраторской панели');
    window.location.href = '../index.html';
  }
  
  // Parse session data
  try {
    const session = JSON.parse(userSession);
    // Update user name in header if it exists
    const userName = session.name || session.email;
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
      userNameElement.textContent = userName;
    }
    
    // Store session info for later use
    window.currentUserSession = session;
    console.log('User logged in:', userName);
  } catch (error) {
    console.error('Error parsing user session:', error);
  }
}

// Check authentication on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkUserAuthentication);
} else {
  checkUserAuthentication();
}

// ========== ACCOUNT DATABASE FUNCTIONS ==========
// Get all accounts from database
function getAllAccounts() {
  try {
    const accounts = localStorage.getItem('cmsPro_accounts');
    return accounts ? JSON.parse(accounts) : [];
  } catch (error) {
    console.error('Error reading accounts:', error);
    return [];
  }
}

// Get account by email
function getAccountByEmail(email) {
  const accounts = getAllAccounts();
  return accounts.find(acc => acc.email === email);
}

// ========== THEME TOGGLE FUNCTIONALITY ==========
function initThemeToggleAdmin() {
  const themeToggle = document.getElementById('themeToggleAdmin');
  const html = document.documentElement;
  
  // Get saved theme from localStorage or default to 'dark'
  const savedTheme = localStorage.getItem('theme') || 'dark';
  
  // Set initial theme
  html.setAttribute('data-theme', savedTheme);
  updateThemeToggleIconAdmin(savedTheme);
  
  // Add click event to theme toggle button
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleThemeAdmin);
  }
}

function toggleThemeAdmin() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  // Update theme
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Update icon
  updateThemeToggleIconAdmin(newTheme);
}

function updateThemeToggleIconAdmin(theme) {
  const themeToggle = document.getElementById('themeToggleAdmin');
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
    themeToggle.title = theme === 'dark' ? 'Переключиться на светлую тему' : 'Переключиться на тёмную тему';
  }
}

// Module Navigation
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(nav => {
      nav.classList.remove('active');
    });
    
    // Add active class to clicked item
    this.classList.add('active');
    
    // Get module name
    const moduleName = this.getAttribute('data-module');
    const moduleId = `module-${moduleName}`;
    
    // Hide all modules
    document.querySelectorAll('.module').forEach(module => {
      module.classList.remove('active');
    });
    
    // Show selected module
    const selectedModule = document.getElementById(moduleId);
    if (selectedModule) {
      selectedModule.classList.add('active');
      
      // Update page title
      const titles = {
        'dashboard': 'Главная панель управления',
        'pages': 'Управление страницами',
        'content': 'Редактор контента',
        'media': 'Библиотека медиа',
        'users': 'Управление пользователями',
        'settings': 'Настройки системы',
        'backup': 'Управление резервными копиями'
      };
      
      document.getElementById('pageTitle').textContent = titles[moduleName] || 'CMS Pro';
    }
    
    // Close sidebar on mobile
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
      sidebar.classList.remove('active');
    }
  });
});

// Initialize theme toggle on page load
document.addEventListener('DOMContentLoaded', function() {
  // Initialize media storage
  initMediaStorage();
  
  initThemeToggleAdmin();
  initLogout();
  
  // Log user session info
  if (window.currentUserSession) {
    console.log('=== User Session ===');
    console.log('Name:', window.currentUserSession.name);
    console.log('Email:', window.currentUserSession.email);
    console.log('Login Time:', window.currentUserSession.loginTime);
    console.log('');
    
    // Show account details
    const account = getAccountByEmail(window.currentUserSession.email);
    if (account) {
      console.log('=== Account Details ===');
      console.log('Account ID:', account.id);
      console.log('Email:', account.email);
      console.log('Name:', account.name);
      console.log('Created:', account.createdAt);
    }
  }
});

// Logout Functionality
function initLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Confirm logout
      if (confirm('Вы уверены, что хотите выйти?')) {
        // Clear session from localStorage
        localStorage.removeItem('userSession');
        
        // Redirect to homepage
        window.location.href = '../index.html';
      }
    });
  }
}

// Menu Toggle for Mobile
const menuToggle = document.getElementById('menuToggle');
if (menuToggle) {
  menuToggle.addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('active');
  });
}

// Закрытие мобильного меню по клику на затемнённый фон
const sidebarOverlay = document.getElementById('sidebarOverlay');
if (sidebarOverlay) {
  sidebarOverlay.addEventListener('click', function() {
    document.querySelector('.sidebar').classList.remove('active');
  });
}

// New Page Button
const newPageBtn = document.getElementById('newPageBtn');
if (newPageBtn) {
  newPageBtn.addEventListener('click', function() {
    const modal = document.getElementById('newPageModal');
    if (modal) {
      modal.classList.add('active');
    }
  });
}

// Modal Close Button
const modalCloseBtn = document.querySelector('.modal-close');
if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', function() {
    this.closest('.modal').classList.remove('active');
  });
}

// Close modal when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('active');
    }
  });
});

// Modal buttons
document.querySelectorAll('.modal-footer .btn').forEach(btn => {
  btn.addEventListener('click', function() {
    if (this.classList.contains('btn-secondary')) {
      this.closest('.modal').classList.remove('active');
    } else if (this.classList.contains('btn-primary')) {
      // Handle form submission
      alert('Новая страница создана!');
      this.closest('.modal').classList.remove('active');
    }
  });
});

// Edit buttons in tables
document.querySelectorAll('.btn-icon').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    const icon = this.querySelector('i');
    
    if (icon.classList.contains('fa-edit')) {
      alert('Открыт редактор...');
    } else if (icon.classList.contains('fa-eye')) {
      alert('Открыт предпросмотр...');
    } else if (icon.classList.contains('fa-trash')) {
      if (confirm('Вы уверены, что хотите удалить?')) {
        alert('Элемент удален!');
      }
    } else if (icon.classList.contains('fa-download')) {
      alert('Загрузка начинается...');
    } else if (icon.classList.contains('fa-undo')) {
      if (confirm('Вы уверены, что хотите восстановить данные?')) {
        alert('Восстановление начинается...');
      }
    }
  });
});

// ========== MEDIA UPLOAD FUNCTIONALITY ==========
// Supported media types
const SUPPORTED_MEDIA_TYPES = {
  images: ['image/jpeg', 'image/png'],
  videos: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
};

// Get all supported MIME types
const ALL_SUPPORTED_TYPES = [...SUPPORTED_MEDIA_TYPES.images, ...SUPPORTED_MEDIA_TYPES.videos];

// Initialize media storage if it doesn't exist
function initMediaStorage() {
  if (!localStorage.getItem('mediaFiles')) {
    localStorage.setItem('mediaFiles', JSON.stringify([]));
  }
}

// Get all media files from storage
function getAllMediaFiles() {
  try {
    const files = localStorage.getItem('mediaFiles');
    return files ? JSON.parse(files) : [];
  } catch (error) {
    console.error('Error reading media files:', error);
    return [];
  }
}

// Save media file to storage
function saveMediaFile(file, preview) {
  try {
    const mediaFiles = getAllMediaFiles();
    const newFile = {
      id: Date.now(),
      name: file.name,
      type: file.type,
      size: file.size,
      preview: preview,
      uploadDate: new Date().toISOString(),
      isImage: file.type.startsWith('image/'),
      isVideo: file.type.startsWith('video/')
    };
    
    mediaFiles.push(newFile);
    localStorage.setItem('mediaFiles', JSON.stringify(mediaFiles));
    return newFile;
  } catch (error) {
    console.error('Error saving media file:', error);
    return null;
  }
}

// Validate file type
function isValidMediaFile(file) {
  return ALL_SUPPORTED_TYPES.includes(file.type);
}

// Get file type label
function getFileTypeLabel(mimeType) {
  if (SUPPORTED_MEDIA_TYPES.images.includes(mimeType)) {
    return 'Изображение';
  } else if (SUPPORTED_MEDIA_TYPES.videos.includes(mimeType)) {
    return 'Видео';
  }
  return 'Неизвестно';
}

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Create media item element
function createMediaItemElement(mediaFile) {
  const mediaItem = document.createElement('div');
  mediaItem.className = 'media-item';
  mediaItem.dataset.mediaId = mediaFile.id;
  
  let previewContent = '';
  
  if (mediaFile.isImage) {
    previewContent = `<img src="${mediaFile.preview}" alt="${mediaFile.name}">`;
  } else if (mediaFile.isVideo) {
    previewContent = `
      <video width="200" height="200" controls style="width: 100%; height: 100%; object-fit: cover;">
        <source src="${mediaFile.preview}" type="${mediaFile.type}">
        Ваш браузер не поддерживает видео тег.
      </video>
    `;
  }
  
  const uploadDate = new Date(mediaFile.uploadDate).toLocaleDateString('ru-RU');
  const fileSize = formatFileSize(mediaFile.size);
  const fileType = getFileTypeLabel(mediaFile.type);
  
  mediaItem.innerHTML = `
    <div class="media-preview">
      ${previewContent}
    </div>
    <div class="media-info">
      <p class="media-name" title="${mediaFile.name}">${mediaFile.name}</p>
      <p class="media-meta">${fileSize} • ${fileType} • ${uploadDate}</p>
      <div class="media-actions">
        <button class="btn-small media-download" title="Скачать"><i class="fas fa-download"></i></button>
        <button class="btn-small media-delete btn-danger" title="Удалить"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `;
  
  // Add event listeners
  mediaItem.querySelector('.media-delete').addEventListener('click', function() {
    if (confirm('Вы уверены, что хотите удалить этот файл?')) {
      deleteMediaFile(mediaFile.id);
      mediaItem.remove();
    }
  });
  
  return mediaItem;
}

// Delete media file
function deleteMediaFile(fileId) {
  try {
    const mediaFiles = getAllMediaFiles();
    const filteredFiles = mediaFiles.filter(f => f.id !== fileId);
    localStorage.setItem('mediaFiles', JSON.stringify(filteredFiles));
  } catch (error) {
    console.error('Error deleting media file:', error);
  }
}

// Upload Button Handler
const uploadBtn = document.getElementById('uploadBtn');
const mediaInput = document.getElementById('mediaInput');

if (uploadBtn && mediaInput) {
  uploadBtn.addEventListener('click', function() {
    mediaInput.click();
  });
  
  mediaInput.addEventListener('change', function(e) {
    const files = e.target.files;
    let validFiles = 0;
    let invalidFiles = [];
    
    // Process each file
    Array.from(files).forEach(file => {
      if (isValidMediaFile(file)) {
        validFiles++;
        
        // Create preview
        const reader = new FileReader();
        reader.onload = function(event) {
          const preview = event.target.result;
          const mediaFile = saveMediaFile(file, preview);
          
          if (mediaFile) {
            // Add to media grid
            const mediaGrid = document.getElementById('mediaGrid');
            const newItem = createMediaItemElement(mediaFile);
            mediaGrid.insertBefore(newItem, mediaGrid.firstChild);
          }
        };
        reader.readAsDataURL(file);
      } else {
        invalidFiles.push(file.name);
      }
    });
    
    // Show feedback
    if (invalidFiles.length > 0) {
      alert(`⚠️ Ошибка!\n\nПоддерживаемые типы файлов:\n• Изображения: JPEG, PNG\n• Видео: MP4, WebM, OGG, MOV\n\nНеподдерживаемые файлы:\n${invalidFiles.join('\n')}`);
    }
    
    if (validFiles > 0) {
      alert(`✅ Успешно загружено ${validFiles} файл(ов)`);
    }
    
    // Reset input
    e.target.value = '';
  });
}

// ========== INITIALIZE MEDIA ON PAGE LOAD ==========
// Media storage is already initialized in DOMContentLoaded event

console.log('=== CMS Pro Media System ===');
console.log('Supported file types:');
console.log('  Images: JPEG, PNG');
console.log('  Videos: MP4, WebM, OGG, MOV');
console.log('');
console.log('API Functions:');
console.log('  getAllMediaFiles() - get all uploaded files');
console.log('  saveMediaFile(file, preview) - save new file to storage');
console.log('  deleteMediaFile(fileId) - delete file from storage');
console.log('  isValidMediaFile(file) - check if file type is supported');

// Upload Button (old code - kept for reference)
/*
const uploadBtn = document.getElementById('uploadBtn');
if (uploadBtn) {
  uploadBtn.addEventListener('click', function() {
    // Create hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = 'image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx';
    
    fileInput.addEventListener('change', function(e) {
      const files = e.target.files;
      if (files.length > 0) {
        let fileNames = [];
        for (let file of files) {
          fileNames.push(file.name);
        }
        alert(`Загружено файлов: ${fileNames.length}\n${fileNames.join('\n')}`);
      }
    });
    
    fileInput.click();
  });
}
*/

// ========== EDIT BUTTONS IN TABLES ==========
const createBackupBtn = document.getElementById('createBackupBtn');
if (createBackupBtn) {
  createBackupBtn.addEventListener('click', function() {
    if (confirm('Создать резервную копию?')) {
      alert('Резервная копия создается. Это может занять несколько минут...');
    }
  });
}

// Logout Button
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('Вы уверены, что хотите выйти?')) {
      alert('До встречи!');
      window.location.href = '../index.html';
    }
  });
}

// Search functionality
const searchInput = document.querySelector('.search-input');
if (searchInput) {
  searchInput.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    // Add search functionality here
    console.log('Search query:', query);
  });
}

// Notification Button
const notificationBtn = document.querySelector('.notification-btn');
if (notificationBtn) {
  notificationBtn.addEventListener('click', function() {
    alert('Уведомления:\n1. Новая страница создана\n2. Загружено изображение\n3. Новый пользователь добавлен');
  });
}

// Settings menu items
document.querySelectorAll('.settings-item').forEach(item => {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    
    document.querySelectorAll('.settings-item').forEach(i => {
      i.classList.remove('active');
    });
    
    this.classList.add('active');
    console.log('Settings section changed:', this.textContent);
  });
});

// Save Settings Button
document.querySelectorAll('.settings-right .btn-primary').forEach(btn => {
  btn.addEventListener('click', function() {
    alert('Настройки сохранены!');
  });
});

// Filter functionality
document.querySelectorAll('.filter-select').forEach(select => {
  select.addEventListener('change', function() {
    console.log('Filter changed:', this.value);
  });
});

// Content editor enhancements
const contentEditor = document.getElementById('contentEditor');
if (contentEditor) {
  // Toolbar button functionality
  document.querySelectorAll('.toolbar-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      const icon = this.querySelector('i');
      const textarea = contentEditor;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      const before = textarea.value.substring(0, start);
      const after = textarea.value.substring(end);
      
      let newText = selectedText;
      
      if (icon.classList.contains('fa-bold')) {
        newText = `**${selectedText}**`;
      } else if (icon.classList.contains('fa-italic')) {
        newText = `*${selectedText}*`;
      } else if (icon.classList.contains('fa-underline')) {
        newText = `__${selectedText}__`;
      } else if (icon.classList.contains('fa-heading')) {
        newText = `# ${selectedText}`;
      } else if (icon.classList.contains('fa-list')) {
        newText = `- ${selectedText}`;
      } else if (icon.classList.contains('fa-quote-left')) {
        newText = `> ${selectedText}`;
      } else if (icon.classList.contains('fa-link')) {
        newText = `[${selectedText}](url)`;
      } else if (icon.classList.contains('fa-image')) {
        newText = `![alt](image-url)`;
      } else if (icon.classList.contains('fa-table')) {
        newText = `| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |`;
      }
      
      textarea.value = before + newText + after;
      textarea.focus();
      textarea.setSelectionRange(start + newText.length, start + newText.length);
    });
  });
}

// Save content button
const saveContentBtn = document.getElementById('saveContentBtn');
if (saveContentBtn) {
  saveContentBtn.addEventListener('click', function() {
    const titleInput = document.querySelector('#module-content .editor-left .form-control');
    const title = titleInput ? titleInput.value : '';
    alert(`Страница "${title}" сохранена!`);
  });
}

// Preview content button
const previewContentBtn = document.getElementById('previewContentBtn');
if (previewContentBtn) {
  previewContentBtn.addEventListener('click', function() {
    const titleInput = document.querySelector('#module-content .editor-left .form-control');
    const title = titleInput ? titleInput.value : 'Без названия';
    const content = contentEditor ? contentEditor.value : '';

    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <title>Предпросмотр: ${title}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1.5rem; line-height: 1.6; color: #1a2847; }
          h1 { border-bottom: 2px solid #3b82f6; padding-bottom: 0.5rem; }
          pre { white-space: pre-wrap; word-wrap: break-word; }
        </style>
      </head>
      <body>
        <h1>${title || 'Без названия'}</h1>
        <pre>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;') || '(содержание пока не введено)'}</pre>
      </body>
      </html>
    `);
    previewWindow.document.close();
  });
}

// Initialize tooltips and animations
document.addEventListener('DOMContentLoaded', function() {
  console.log('Admin Panel loaded successfully!');
  
  // Add ripple effect to buttons
  document.querySelectorAll('.btn, .btn-icon, .btn-small').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255, 255, 255, 0.5)';
      ripple.style.width = '20px';
      ripple.style.height = '20px';
      ripple.style.animation = 'ripple 0.6s ease-out';
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
  
  // Add ripple animation style
  if (!document.querySelector('style[data-ripple-admin]')) {
    const style = document.createElement('style');
    style.setAttribute('data-ripple-admin', 'true');
    style.textContent = `
      @keyframes ripple {
        to {
          width: 100px;
          height: 100px;
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'slideInUp 0.6s ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.stat-card, .activity-item').forEach(el => {
    observer.observe(el);
  });
});

// Add slideInUp animation
const animStyle = document.createElement('style');
animStyle.textContent = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(animStyle);

// Handle window resize for responsive sidebar
window.addEventListener('resize', function() {
  if (window.innerWidth > 768) {
    document.querySelector('.sidebar').classList.remove('active');
  }
});
