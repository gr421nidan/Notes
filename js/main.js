Vue.component('column', {
    template: `
<div>
    <div class="content_form">
    <form @submit.prevent="addNote">
        <label for="card-name">Создайте свою заметку:</label>
        <input  class="input" id="card-name" type="text" v-model="noteName"><br>

        <label for="card-list">Создайте пункты заметки:</label><br>
        <textarea id="card-list" v-model="checkText"></textarea><br>

        <button type="submit">Создать</button>
    </form>
    </div>
     <div class="content">
            <div class="column">
                <h2 class="title_column">Новые</h2>
                <div v-for="note in notesList" :key="note.id" class="note">
                    <h3>{{ note.title }}</h3>
                    <div>
                        <ul>
                            <li v-for="item in note.items" :key="item.id">
                                <input type="checkbox" v-model="item.completed" @change="moveCard(note)">
                                <span :class="{ completed: item.completed }">{{ item.text }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="column">
                <h2 class="title_column">В процессе</h2>
                <div v-for="note in notesListProgress" :key="note.id" class="note">
                    <h3>{{ note.title }}</h3>
                    <ul>
                        <li v-for="item in note.items" :key="item.id">
                            <input type="checkbox" v-model="item.completed" @change="moveCard(note)">
                            <span :class="{ completed: item.completed }">{{ item.text }}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="column">
                <h2 class="title_column">Завершённые</h2>
                <div v-for="note in notesListCompleted" :key="note.id" class="note">
                    <h3>{{ note.title }}</h3>
                    <ul>
                        <li v-for="item in note.items" :key="item.id">
                            <input type="checkbox" v-model="item.completed">
                            <span :class="{ completed: item.completed }">{{ item.text}}</span>
                        </li>
                    </ul>
                    <div v-if="note.completedDate">
                        Последнее выполнение: {{ note.completedDate }}
                    </div>
                </div>
            </div>
        </div>
</div>`,

    data() {
        return {
            notesList: [],
            notesListProgress: [],
            notesListCompleted: [],
            noteName: '',
            checkText: '',
        }
    },
    mounted(){
        if (localStorage.getItem('notesList')) {
            try {
                this.notesList = JSON.parse(localStorage.getItem('notesList'));
            } catch(e) {
                localStorage.removeItem('notesList');
            }
        }
        if (localStorage.getItem('notesListProgress')) {
            try {
                this.notesListProgress = JSON.parse(localStorage.getItem('notesListProgress'));
            } catch(e) {
                localStorage.removeItem('notesListProgress');
            }
        }
        if (localStorage.getItem('notesListCompleted')) {
            try {
                this.notesListCompleted = JSON.parse(localStorage.getItem('notesListCompleted'));
            } catch(e) {
                localStorage.removeItem('notesListCompleted');
            }
        }


    },

    methods: {

        addNote() {
            if (this.noteName !== '' && this.notesList.length < 3) {
                const newNote = {
                    id: Date.now(),
                    title: this.noteName,
                    items: this.checkText.split('\n').filter(item => item.trim() !== '').map(item => ({ text: item, completed: false }))
                };
                if (this.noteName !== '' && newNote.items.length >= 3 && newNote.items.length <= 5) {
                    this.notesList.push(newNote);
                }
                else alert("Введите минимум 3 задачи! \n Каждую на отдельной строке")
                {

                }
                this.moveCard(newNote);
                this.noteName = '';
                this.checkText = '';
                this.saveLocalStorage();
            }
        },

        moveCard(note) {
            const totalItems = note.items.length;
            const completedItems = note.items.filter(item => item.completed).length;


            if (completedItems / totalItems > 0.5 && this.notesList.includes(note)) {

                if(this.notesListProgress.length>=5) {
                    alert('Выполните задачи 2 столбца!')
                }
                else {
                    this.notesList.splice(this.notesList.indexOf(note), 1);
                    this.notesListProgress.push(note);
                    this.saveLocalStorage();
                }

            }

            else if (completedItems / totalItems === 1 && this.notesListProgress.includes(note)) {
                this.notesListProgress.splice(this.notesListProgress.indexOf(note), 1);
                this.notesListCompleted.push(note);
                note.completedDate = new Date().toLocaleString();
                this.saveLocalStorage();

            }
        },
        saveLocalStorage() {
            const parsed1 = JSON.stringify(this.notesList);
            const parsed2 = JSON.stringify(this.notesListProgress);
            const parsed3 = JSON.stringify(this.notesListCompleted);
            localStorage.setItem('notesList', parsed1);
            localStorage.setItem('notesListProgress', parsed2);
            localStorage.setItem('notesListCompleted', parsed3);

        },

    }
});

let app = new Vue({
    el: '#app',
});