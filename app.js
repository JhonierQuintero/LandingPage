// Crear elementos de código flotante
function createFloatingCode() {
    const characters = ['{', '}', '(', ')', ';', '<', '>', '/', '=', '*', '+', 'const', 'let', 'function', 'return', 'class', 'import'];
    const container = document.body;
    
    for (let i = 0; i < 20; i++) {
        const codeElement = document.createElement('div');
        codeElement.classList.add('floating-code');
        codeElement.textContent = characters[Math.floor(Math.random() * characters.length)];
        
        // Posición aleatoria
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const size = Math.random() * 24 + 12;
        const opacity = Math.random() * 0.1 + 0.05;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        
        codeElement.style.left = `${left}%`;
        codeElement.style.top = `${top}%`;
        codeElement.style.fontSize = `${size}px`;
        codeElement.style.opacity = opacity;
        codeElement.style.animation = `float ${duration}s infinite ease-in-out`;
        codeElement.style.animationDelay = `${delay}s`;
        
        container.appendChild(codeElement);
    }
}

// Efecto de escritura en el título
function typeWriterEffect() {
    const title = document.querySelector('.hero h1');
    const text = title.textContent;
    title.textContent = '';
    
    let i = 0;
    const speed = 100;
    
    function type() {
        if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}


// Efecto parallax para la sección hero
function initParallax() {
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
        }
    });
}

// Inicialización cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
    createFloatingCode();
    typeWriterEffect();
    initSmoothScrolling();
    initParallax();
    
    // Cambiar fondo de la navbar al hacer scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(15, 15, 30, 0.95)';
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.backgroundColor = 'rgba(15, 15, 30, 0.9)';
            navbar.style.boxShadow = 'none';
        }
    });
});

const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

let inactivityAlertTimer;
let inactivityResetTimer;

function resetInactivityTimers() {
  clearTimeout(inactivityAlertTimer);
  clearTimeout(inactivityResetTimer);

  // 2 minutos: alerta de inactividad
  inactivityAlertTimer = setTimeout(() => {
    chatBox.innerHTML += `
      <div class="message bot">
        <div class="bubble bot-bubble">
          <span><em>¿Sigues ahí? Han pasado 2 minutos sin actividad.</em></span>
        </div>
      </div>
    `;
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 2 * 60 * 1000); // 2 min

  // 5 minutos: limpieza automática
  inactivityResetTimer = setTimeout(() => {
    chatBox.innerHTML += `
      <div class="message bot">
        <div class="bubble bot-bubble">
          <span><em>Sesión finalizada por inactividad. Chat limpiado automáticamente.</em></span>
        </div>
      </div>
    `;
    setTimeout(() => {
      chatBox.innerHTML = "";
    }, 3000); // esperar 3 segundos antes de limpiar
  }, 5 * 60 * 1000); // 5 min
}

// Activar timers desde el inicio
resetInactivityTimers();

// Evento principal del formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  resetInactivityTimers(); // Reinicia los temporizadores

  const pregunta = input.value.trim();
  if (!pregunta) return;

  // Agregar mensaje del usuario
  chatBox.innerHTML += `
    <div class="message user">
      <div class="bubble user-bubble">
        <span>${pregunta}</span>
      </div>
    </div>
  `;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  // Mostrar "escribiendo..." del bot
  const typingId = `typing-${Date.now()}`;
  chatBox.innerHTML += `
    <div class="message bot" id="${typingId}">
      <div class="bubble bot-bubble typing">Escribiendo<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></div>
    </div>
  `;
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pregunta })
    });

    const data = await response.json();

    // Reemplazar "typing..." con la respuesta real
    const typingDiv = document.getElementById(typingId);
    typingDiv.innerHTML = `
      <div class="bubble bot-bubble">
        <span>${data.respuesta}</span>
      </div>
    `;
  } catch (error) {
    const typingDiv = document.getElementById(typingId);
    typingDiv.innerHTML = `
      <div class="bubble bot-bubble error">
        <span><strong>Error:</strong> No se pudo conectar al servidor.</span>
      </div>
    `;
  }

  chatBox.scrollTop = chatBox.scrollHeight;
});

// Reiniciar timers en interacción con input y scroll
input.addEventListener("keydown", resetInactivityTimers);
chatBox.addEventListener("scroll", resetInactivityTimers);