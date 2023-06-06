export class Project{
    constructor(name, description){
        this.name = name;
        this.description = description;
        this.todos = [];
    }

}

export class Todo{
    constructor(name, description, check, dueDate){
        this.name = name;
        this.description = description;
        this.check = check;
        this.dueDate = dueDate;
    }
    
}
