const bettersqlite3 = require('better-sqlite3');

class Database {
    constructor() {
        this.db = new bettersqlite3('board.db');
    }

    execute(query, params = []) {
        try {
            const statement = this.db.prepare(query)
            const result = statement.run(params);
            return { lastID: result.lastInsertRowid, changes: result.changes }
        } catch(error) {
            throw error;
        }
    }

    executeQuery(query, params = []) {
        
    }

    close() {
        try {
            this.db.close();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Database;