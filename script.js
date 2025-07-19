class TodoList {
    constructor() {
        this.todos = [];
        this.nextId = 1;
        this.loadFromLocalStorage();
        this.bindEvents();
        this.render();
    }
    bindEvents() {
        const addBtn = document.getElementById('addBtn');
        const todoInput = document.getElementById('todoInput');
        addBtn.addEventListener('click', () => this.addTodo());
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
    }
    addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();
        if (text === '')
            return;
        const newTodo = {
            id: this.nextId++,
            text: text,
            completed: false,
            createdAt: new Date()
        };
        this.todos.push(newTodo);
        input.value = '';
        this.saveToLocalStorage();
        this.render();
    }
    toggleTodoInternal(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToLocalStorage();
            this.render();
        }
    }
    deleteTodoInternal(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveToLocalStorage();
        this.render();
    }
    render() {
        const todoList = document.getElementById('todoList');
        const totalTasks = document.getElementById('totalTasks');
        const completedTasks = document.getElementById('completedTasks');
        todoList.innerHTML = '';
        this.todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <div class="todo-content">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                           onchange="todoApp.toggleTodo(${todo.id})">
                    <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                    <small class="todo-date">${this.formatDate(todo.createdAt)}</small>
                </div>
                <button class="delete-btn" onclick="todoApp.deleteTodo(${todo.id})">削除</button>
            `;
            todoList.appendChild(li);
        });
        const completed = this.todos.filter(t => t.completed).length;
        totalTasks.textContent = `総タスク数: ${this.todos.length}`;
        completedTasks.textContent = `完了: ${completed}`;
    }
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    formatDate(date) {
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    saveToLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
        localStorage.setItem('nextId', this.nextId.toString());
    }
    loadFromLocalStorage() {
        const todosJson = localStorage.getItem('todos');
        const nextIdStr = localStorage.getItem('nextId');
        if (todosJson) {
            this.todos = JSON.parse(todosJson).map((todo) => (Object.assign(Object.assign({}, todo), { createdAt: new Date(todo.createdAt) })));
        }
        if (nextIdStr) {
            this.nextId = parseInt(nextIdStr);
        }
    }
    toggleTodo(id) {
        this.toggleTodoInternal(id);
    }
    deleteTodo(id) {
        this.deleteTodoInternal(id);
    }
}
const todoApp = new TodoList();