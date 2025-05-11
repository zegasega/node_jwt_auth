class BaseService {
  constructor(model) {
    this.model = model;
  }

  async findAll(options = {}) {
    try {
      return await this.model.findAll(options);
    } catch (error) {
      console.error('Error fetching all:', error);
      throw error;
    }
  }

  async findByPk(id, options = {}) {
    try {
      return await this.model.findByPk(id, options);
    } catch (error) {
      console.error(`Error fetching by ID ${id}:`, error);
      throw error;
    }
  }

  async findOne(where, options = {}) {
    try {
      return await this.model.findOne({ where, ...options });
    } catch (error) {
      console.error('Error fetching one:', error);
      throw error;
    }
  }

  async create(data) {
    try {
      return await this.model.create(data);
    } catch (error) {
      console.error('Error creating:', error);
      throw error;
    }
  }

  async update(id, data, options = {}) {
    try {
      const [affectedRows] = await this.model.update(data, {
        where: { id },
        ...options,
      });
      if (affectedRows === 0) {
        return null; // Indicate that no record was updated
      }
      return await this.findByPk(id); // Return the updated record
    } catch (error) {
      console.error(`Error updating ID ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const deletedRows = await this.model.destroy({
        where: { id },
      });
      return deletedRows > 0; // Return true if a record was deleted
    } catch (error) {
      console.error(`Error deleting ID ${id}:`, error);
      throw error;
    }
  }
}

module.exports = BaseService;