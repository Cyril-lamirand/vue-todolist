new Vue({
    el : '#todo-app',

    data : function() {
        return {
            todos : [], // Au départ, aucune tâche dans le tableau
            newTaskName : '',
            taskFilter : 'all', // isDone, isNotDone
            editMode : [],
        }
    },

    computed : {
        remaining : function() {
            return this.todos.filter(task => task.isDone === false).length;
        },
        filteredTodos : function () {
            if (this.taskFilter === 'all') {
                return this.todos;
            }
            else if (this.taskFilter === 'isNotDone') {
                return this.todos.filter(task => task.isDone === false);
            }
            else if (this.taskFilter === 'isDone') {
                return this.todos.filter(task => task.isDone === true);
            }
        }
    },

    methods : {
        addTask : function() {
            if (this.newTaskName === '') return;

            this.todos.push({
                title : this.newTaskName,
                isDone : false,
            });

            this.newTaskName = '';
        },
        removeTask : function(index) {
            if (this.todos[index] !== undefined) {
                this.todos.splice(index, 1);
            }
        },
        purgeTodos : function() {
            this.todos = this.todos.filter(task => task.isDone === false);
            this.editMode.length = 0;
        },
        toggleEditMode : function(index) {
            let pos = this.editMode.indexOf(index);
            if (pos > -1) {
                this.editMode.splice(pos, 1);
            } else {
                this.editMode.push(index);
                Vue.nextTick(() => {
                    this.$refs.editField[index].focus();
                });
            }
        }
    },

    /*
        ======================================================
        Ces éléments que l'on a pas eu le temps de voir s'appellent des "hooks".
        ======================================================
    */

    /*
        Le hook "watch" de Vue.js permet de surveiller n'importe quel changement intervenant sur les propriétés
        réactives, et de déclencher du code personnalisé.
        Ici, nous voulons à chaque modification sur l'élément "todos" sauvegarder son état dans le localStorage
        du navigateur
    */
    watch : {
        todos : {
            handler : function(newVal) {
                // Cette fonction sera déclanchée à chaque changement de la propriété reactive "todos"

                // Sauvegarde dans le localStorage du navigateur ...
                window.localStorage.setItem('vuetodo:tasks', JSON.stringify(this.todos));
            },
            deep : true,
        }
    },

    /*
        Le hook "created" de Vue.js permet d'exécuter du code lorsque le composant démarre
        C'est une sorte de $(document).ready() , mais pour le component (enfin, c'est pour illustrer l'idée hein ...)
    */
    created : function() {

        // Récupération des tâches dans le localStorage du navigateur
        // Si il n'y a rien dans le localStorage, on place un tableau vide [] à la place
        this.todos = JSON.parse(window.localStorage.getItem('vuetodo:tasks')) || [];

    }
});