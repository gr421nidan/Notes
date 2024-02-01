Vue.component('column', {
    template: `
<div>
    <div class="content_form">
    <form @submit.prevent="addNote">
        <label for="card-name">Создайте свою заметку:</label>
        <input id="card-name" type="text" v-model="noteName"><br>

        <label for="card-list">Создайте пункты заметки:</label><br>
        <textarea id="card-list" v-model="checkText"></textarea><br>

        <button type="submit">Создать</button>
    </form>
    </div>
    <div class="content">
        <div class="left_column">
            <h2 class="title_column">Новые</h2>
            
        </div>
        <div class="middle_column">
            <h2 class="title_column">В процессе</h2>
            
        </div>
        <div class="right_column">
            <h2 class="title_column">Завершённые</h2>
            
    
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
                this.noteName = '';
                this.checkText = '';


            }
        },

    }
});

let app = new Vue({
    el: '#app',
});