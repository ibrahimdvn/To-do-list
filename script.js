document.addEventListener("DOMContentLoaded", () => {
    // Statik olay dinleyicilerini ayarla
    document.getElementById('todoInput').addEventListener("keypress", handleInput);
    document.getElementById('clearCompletedBtn').addEventListener('click', clearCompleted);
    
    // Filtre butonları
    const filterButtons = document.querySelectorAll('.filters button');
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            filterTodos(e.target.textContent.toLowerCase());
        });
    });

    // Kayıtlı görevleri yükle ve tarihi ayarla
    loadTodos();
    setCurrentDate();
});

function handleInput(e) {
    if (e.key === "Enter") {
        const input = e.target;
        const taskText = input.value.trim();
        if (taskText) {
            createTodoElement(taskText, false);
            input.value = '';
            saveTodos();
        }
    }
}

function createTodoElement(text, isCompleted) {
    const list = document.getElementById('todoList');
    const li = document.createElement('li');
    if (isCompleted) li.classList.add('completed');

    // Görev içeriği (checkbox + metin)
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';
    taskContent.innerHTML = `
        <span class="custom-checkbox">
            <i class="fas fa-check"></i>
        </span>
        <span class="task-text">${text}</span>
    `;

    // Silme butonu
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';

    li.appendChild(taskContent);
    li.appendChild(deleteBtn);
    
    // Olay dinleyicileri
    taskContent.addEventListener('click', () => toggleTodo(li));
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTodo(li);
    });

    list.appendChild(li);
    updateUI();
}

function toggleTodo(li) {
    li.classList.toggle('completed');
    saveTodos();
    updateUI();
}

function deleteTodo(li) {
    li.style.opacity = '0'; // Silmeden önce animasyon
    setTimeout(() => {
        li.remove();
        saveTodos();
        updateUI();
    }, 300);
}

function clearCompleted() {
    const completedTasks = document.querySelectorAll('#todoList li.completed');
    completedTasks.forEach(task => deleteTodo(task));
}

// Arayüzü güncelleyen ana fonksiyon
function updateUI() {
    updateTaskCount();
    checkEmpty();
    const activeFilter = document.querySelector('.filters button.active')?.textContent.toLowerCase() || 'all';
    filterTodos(activeFilter);
}

function updateTaskCount() {
    const total = document.querySelectorAll('#todoList li').length;
    const completed = document.querySelectorAll('#todoList li.completed').length;
    const remaining = total - completed;
    document.getElementById('taskCount').textContent = `${remaining} tasks remaining`;
}

function checkEmpty() {
    const hasTasks = document.querySelectorAll('#todoList li').length > 0;
    document.getElementById('emptyState').classList.toggle('hidden', hasTasks);
}

function filterTodos(filter) {
    const items = document.querySelectorAll('#todoList li');
    items.forEach(item => {
        switch (filter) {
            case 'active':
                item.style.display = item.classList.contains('completed') ? 'none' : 'flex';
                break;
            case 'completed':
                item.style.display = item.classList.contains('completed') ? 'flex' : 'none';
                break;
            default: // 'all' durumu
                item.style.display = 'flex';
                break;
        }
    });
}

function saveTodos() {
    const todos = [];
    document.querySelectorAll('#todoList .task-text').forEach((taskSpan, index) => {
        const li = taskSpan.closest('li');
        todos.push({
            text: taskSpan.textContent,
            isCompleted: li.classList.contains('completed')
        });
    });
    localStorage.setItem('taskifyApp', JSON.stringify(todos));
}

function loadTodos() {
    const savedTodos = JSON.parse(localStorage.getItem('taskifyApp') || '[]');
    savedTodos.forEach(todo => createTodoElement(todo.text, todo.isCompleted));
    updateUI();
}

function setCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = today.toLocaleDateString('en-US', options);
}
