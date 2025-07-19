interface TodoItem {
    id: number;
    text: string;
    completed: boolean;
    createdAt: Date;
}

class TodoList {
    private todos: TodoItem[] = [];
    private nextId: number = 1;

    constructor() {
        this.loadFromLocalStorage();
        this.bindEvents();
        this.render();
    }

    private bindEvents(): void {
        const addBtn = document.getElementById('addBtn') as HTMLButtonElement;
        const todoInput = document.getElementById('todoInput') as HTMLInputElement;

        addBtn.addEventListener('click', () => this.addTodo());
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
    }

    private addTodo(): void {
        const input = document.getElementById('todoInput') as HTMLInputElement;
        const text = input.value.trim();

        if (text === '') return;

        const newTodo: TodoItem = {
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

    private toggleTodo(id: number): void {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToLocalStorage();
            this.render();
        }
    }

    private deleteTodo(id: number): void {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveToLocalStorage();
        this.render();
    }

    private render(): void {
        const todoList = document.getElementById('todoList') as HTMLUListElement;
        const totalTasks = document.getElementById('totalTasks') as HTMLSpanElement;
        const completedTasks = document.getElementById('completedTasks') as HTMLSpanElement;

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

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    private formatDate(date: Date): string {
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    private saveToLocalStorage(): void {
        localStorage.setItem('todos', JSON.stringify(this.todos));
        localStorage.setItem('nextId', this.nextId.toString());
    }

    private loadFromLocalStorage(): void {
        const todosJson = localStorage.getItem('todos');
        const nextIdStr = localStorage.getItem('nextId');

        if (todosJson) {
            this.todos = JSON.parse(todosJson).map((todo: any) => ({
                ...todo,
                createdAt: new Date(todo.createdAt)
            }));
        }

        if (nextIdStr) {
            this.nextId = parseInt(nextIdStr);
        }
    }

    public toggleTodo(id: number): void {
        this.toggleTodo(id);
    }

    public deleteTodo(id: number): void {
        this.deleteTodo(id);
    }
}

const todoApp = new TodoList();