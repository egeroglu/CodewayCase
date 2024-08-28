<template>
  <div class="home-container">
    <header>
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <UserIcon />
    </header>
    <div class="content-container">
      <table class="responsive-table">
        <thead>
          <tr>
            <th>Parameter Key</th>
            <th>Value</th>
            <th>Description</th>
            <th @click="toggleSort" style="cursor: pointer;">
              Create Date
              <span v-if="sortDirection === 'asc'">&#9650;</span>
              <span v-if="sortDirection === 'desc'">&#9660;</span>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in sortedData" :key="index">
            <td data-label="Parameter Key">{{ item.parameter_key }}</td>
            <td data-label="Value">
              <input v-if="editIndex === index" v-model="editItem.value" :placeholder="item.value" />
              <span v-else>{{ item.value }}</span>
            </td>
            <td data-label="Description" class="description-column">
              <input v-if="editIndex === index" v-model="editItem.description" :placeholder="item.description" />
              <span v-else>{{ item.description }}</span>
            </td>
            <td data-label="Create Date">{{ item.create_date }}</td>
            <td data-label="">
              <button class="edit-btn" @click="toggleEdit(index)">
                {{ editIndex === index ? 'Save' : 'Edit' }}
              </button>
              <button v-if="editIndex !== index" class="delete-btn" @click="deleteItem(index)">Delete</button>
            </td>
          </tr>
          <tr>
            <td><input v-model="newItem.parameter_key" placeholder="New Parameter" /></td>
            <td><input v-model="newItem.value" placeholder="Value" /></td>
            <td colspan="2"><input v-model="newItem.description" placeholder="New Description" /></td>
            <td><button class="add-btn" @click="addItem">Add</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

  
<script>
  import axios from 'axios';
  import UserIcon from '../components/UserIcon.vue';

  export default {
    name: 'HomePage',
    components: {
      UserIcon
    },
    data() {
      return {
        data: [],
        newItem: {
          parameter_key: '',
          value: '',
          description: '',
          create_date:''
        },
        editIndex: null,
        editItem: {
          value: '',
          description: ''
        },
        sortDirection: 'asc'
      };
    },
    computed: {
      sortedData() {
        return [...this.data].sort((a, b) => {
          if (this.sortDirection === 'asc') {
            return new Date(a.create_date) - new Date(b.create_date);
          } else {
            return new Date(b.create_date) - new Date(a.create_date);
          }
        });
      }
    },
    methods: {
      async fetchData() {
        try {
          const response = await axios.get('http://localhost:8080/api/parameters');
          this.data = response.data.map(item => ({
            parameter_key: item.parameter_key,
            value: item.value,
            description: item.description,
            create_date: item.create_date
          }));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      },
      toggleSort() {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      },
      toggleEdit(index) {
        if (this.editIndex === index) {
          this.saveEdit(index);
        } else {
          this.editIndex = index;
          this.editItem = { ...this.data[index] };
        }
      },
      async saveEdit(index) {
        const item = this.data[index];
        try {
          await axios.put(`http://localhost:8080/api/parameter/${item.parameter_key}`, {
            parameter_key: item.parameter_key,
            value: this.editItem.value,
            description: this.editItem.description
          });
          this.data[index] = { ...item, ...this.editItem }; 
          this.editIndex = null;
          alert('Item updated successfully!');
        } catch (error) {
          console.error('Error updating item:', error);
          alert('Failed to update item.');
        }
      },
      async deleteItem(index) {
        const item = this.data[index];
        try {
          await axios.delete(`http://localhost:8080/api/parameter/${item.parameter_key}`);
          this.data.splice(index, 1);
          alert('Item deleted successfully!');
        } catch (error) {
          console.error('Error deleting item:', error);
          alert('Failed to delete item.');
        }
      },
      async addItem() {
        if (this.newItem.parameter_key && this.newItem.value && this.newItem.description) {
          const now = new Date();
          const formattedDate = now.toISOString().slice(0, 16).replace('T', ' ');
          const newItemWithDate = {
            parameter_key: this.newItem.parameter_key,
            value: this.newItem.value,
            description: this.newItem.description,
            create_date: formattedDate
          };
          try {
            await axios.post('http://localhost:8080/api/parameter', newItemWithDate);
            this.data.push(newItemWithDate);
            this.newItem = { parameter_key: '', value: '', description: '' };
          } catch (error) {
            console.error('Error adding item:', error);
            alert('Failed to add item.');
          }
        }
      }
    },
    created() {
      this.fetchData();
    }
  };
</script>

  
<style scoped>
  .home-container {
    padding: 0;
  }
  
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgb(30, 31, 45); 
    color: white;
    margin: 0;
    padding: 10px 20px;
    width: 100%;
    box-sizing: border-box;
  }
  
  .content-container {
    padding: 20px;
  }
  
  .logo {
    width: 7%;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  th {
    background-color: transparent;
    text-align: left;
    color: rgb(122, 137, 159);
  }
  
  td {
    border: none;
    padding-bottom: 10px;
    color: rgb(255, 255, 255);
  }
  
  .description-column {
    width: 40%;
  }
  
  button {
    padding: 5px 10px;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
  
  .edit-btn {
    background: linear-gradient(to top right, rgb(0, 123, 255), rgb(135, 206, 250));
    margin-right: 10px;
  }
  
  .delete-btn {
    background: linear-gradient(to top right, rgb(255, 0, 0), rgb(255, 105, 97));
  }
  
  .add-btn {
    background: linear-gradient(to top right, rgb(40, 167, 69), rgb(144, 238, 144));
  }
  
  button:hover {
    opacity: 0.9;
  }
  
  input {
    padding: 5px;
    width: 100%;
    box-sizing: border-box;
    background-color: rgb(30, 31, 45);
    border: 1px solid rgb(45,52,81);
    border-radius: 5px;
    color: white;
  }
  
  @media (max-width: 768px) {
    .logo {
      width: 20%;
    }

    table {
      border: 0;
    }

    thead {
      display: none;
    }

    tr {
      margin-bottom: 15px;
      display: block;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 10px;
    }

    td {
      border: none;
      display: block;
      text-align: left;
      white-space: nowrap;
    }

    td::before {
      content: attr(data-label);
      font-weight: bold;
      margin-right: 5px;
    }

    td[data-label="Parameter Key"]::before,
    td[data-label="Value"]::before,
    td[data-label="Description"]::before,
    td[data-label="Create Date"]::before {
      content: attr(data-label) ": ";
    }

    td[data-label=""] {
      text-align: center;
      padding-left: 0;
    }

    td[data-label="Value"] input {
      width: 50%; /* Küçültülmüş boyut */
      padding: 5px;
      font-size: 14px;
    }

    td[data-label="Description"] input {
      width: 100%; /* Mevcut genişlikte kalabilir */
      padding: 5px;
      font-size: 14px;
    }
  }

</style>
  