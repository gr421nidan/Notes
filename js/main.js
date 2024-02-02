Vue.component('column', {
    template: `
<div>
    <div class="content_form">
    <form @submit.prevent="addNote">
        <label for="card-name">Создайте название заметки:</label>
        <input  class="input" id="card-name" type="text" v-model="noteName" :disabled="checkedCount===5 && !checked"><br>
        <label for="selected-num">Поставьте приоритет</label>
        <select v-model="selected" id="selected-num">
          <option disabled value="">Выберите один из вариантов</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </select><br>
        <label for="card-list">Создайте пункты заметки:</label><br>
        <input class="input" type="text" v-model="noteItems[0]" :disabled="checkedCount===5 && !checked"><br><br>
        <input class="input" type="text" v-model="noteItems[1]" :disabled="checkedCount===5 && !checked"><br><br>
        <input  class="input" type="text" v-model="noteItems[2]" :disabled="checkedCount===5 && !checked"><br><br>
        
        <div v-for="(item, index) in addItems" :key="index">
            <input class="input" type="text" v-model="addItems[index]" :disabled="checkedCount===5 && !checked"><br><br>
        </div>
        <div class="button-row">
            <button type="button" @click="addItem" v-if="addItems.length<2">Добавить пункт</button>
            <button type="submit" :disabled="checkedCount===5 && !checked">Создать</button>
        </div>
        
    </form>
    </div>
     <div class="content">
            <div class="column">
                <h2 class="title_column">Новые</h2>
                <div v-for="note in notesList" :key="note.id" class="note">
                    <span>{{ note.selected }}</span>
                    <h3>{{ note.title }}</h3>
                    <div>
                        <ul>
                            <li v-for="item in note.items" :key="item.id">
                                <input type="checkbox" v-model="item.completed" @change="moveCard(note)" :disabled="checkedCount===5 && !checked">
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
                    <div class="data" v-if="note.completedDate">
                        Завершено: {{ note.completedDate }}
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
            check: true,
            selected: '',
            noteItems: ['','',''],
            addItems: [],

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
            if(this.noteName !== '' && this.notesList.length < 3 && this.noteItems.every(item=>item.trim() !=='')) {
                const items = this.noteItems;
                if (items.length >= 3 && items.length <= 5) {
                    const allItems = [...items, ...this.addItems.filter(item => item.trim() !== '')];
                    const newNote = {
                        selected: this.selected,
                        id: Date.now(),
                        title: this.noteName,
                        items: allItems.map(item => ({text: item, completed: false}))
                    };
                    this.notesList.push(newNote);
                    this.noteName = '';
                    this.noteItems = ['', '', ''];
                    this.addItems = [];
                    this.moveCard(newNote);
                    this.saveLocalStorage();
                }
            }else {
                alert('Добавте пункты задачи')

            }
        },
        addItem(){
            if(this.addItems.length<2){
                this.addItems.push('');
            }
            else{
                alert('Больше нельзя добавить!')
            }
        },

        moveCard(note) {
            const totalItems = note.items.length;
            const completedItems = note.items.filter(item => item.completed).length;


            if (completedItems / totalItems >= 0.5 && this.notesList.includes(note)) {
                if(this.notesListProgress.length ===5 && completedItems / totalItems >= 0.5 && this.notesList.includes(note) ){
                    this.check = false
                }
                else {
                        this.notesList.splice(this.notesList.indexOf(note), 1);
                        this.notesListProgress.push(note);
                        this.saveLocalStorage();
                    }

            }
            else if (completedItems / totalItems === 1 && this.notesListProgress.includes(note)) {
                this.notesListProgress.splice(this.notesListProgress.indexOf(note), 1);
                this.check = true
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

    },
    computed: {
        checkedCount(){
            return this.notesListProgress.length
        },
        checked(){
            return this.check
        }
    }
});

let app = new Vue({
    el: '#app',
});