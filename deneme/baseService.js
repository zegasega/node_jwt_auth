class BaseService {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        try {
            return await this.model.create(data);
        } catch (error) {
            console.error('Error creating:', error);
            throw error;
        }
    }

    async findById(id) {
        try {
            return await this.model.findByPk(id);
        } catch (error) {
            console.error('Error finding by ID:', error);
            throw error;
        }
    }

    async findAll() {
        try {
            return await this.model.findAll();
        } catch (error) {
            console.error('Error finding all:', error);
            throw error;
        }
    }

    async update(id, data) {
        try {
            const [updatedRows] = await this.model.update(data, {
                where: { id },
            });
            if (updatedRows > 0) {
                return await this.findById(id);
            }
            return null; // Or throw an error indicating not found
        } catch (error) {
            console.error('Error updating:', error);
            throw error;
        }
    }

    async deleteById(id) {
        try {
            const deletedRows = await this.model.destroy({
                where: { id },
            });
            return deletedRows > 0;
        } catch (error) {
            console.error('Error deleting:', error);
            throw error;
        }
    }
}

module.exports = BaseService;
