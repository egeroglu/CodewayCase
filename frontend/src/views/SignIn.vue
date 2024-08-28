<template>
  <div class="signin-container">
    <img src="@/assets/logo.png" alt="Logo" class="logo" />
    <p class="signin-text">Please sign in</p>
    <div class="input-group">
      <input
        type="email"
        placeholder="E-mail address"
        v-model="email"
        class="input-field top"
      />
      <input
        type="password"
        placeholder="Password"
        v-model="password"
        class="input-field bottom"
      />
    </div>
    <button @click="signIn">Sign In</button>
    <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
    <p class="copyright">Codeway &#169; 2021</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SignIn',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async signIn() {
      if (this.email && this.password) {
        try {
          const response = await axios.post('http://localhost:8080/api/signin', {
            email: this.email,
            password: this.password
          });
          if (response.data) {
            localStorage.setItem('isAuthenticated', 'true');
            this.$router.push('/home');
          }
        } catch (error) {
          this.errorMessage = 'Invalid email or password. Please try again.';
          this.email = '';
          this.password = '';
        }
      } else {
        this.errorMessage = 'Please enter your email and password.';
      }
    }
  }
};
</script>

<style scoped>
.signin-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: rgb(30, 31, 45); 
  padding: 20px;
}

.logo {
  width: 300px;
  margin-bottom: 20px;
}

.signin-text {
  color: rgb(48,48,85);
  font-size: 18px;
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
}

.input-field {
  padding: 15px;
  border: 1px solid #828282;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
  background-color: rgb(30, 31, 45); 
  color: white;
}

.input-field:focus {
  border-color: #ab1bc4;
}

.input-field.top {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.input-field.bottom {
  border-top: none;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

button {
  padding: 15px 30px;
  width: 100%;
  max-width: 400px;
  background-color: #3b64dd;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #3b64dd;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.copyright {
  margin-top: 75px;
  font-size: 12px;
  color: #666;
}

@media (max-width: 500px) {
  .logo {
    width: 150px;
    margin-bottom: 20px;
  }

  .signin-text {
    font-size: 16px;
  }

  .input-field {
    padding: 12px;
    font-size: 14px;
  }

  button {
    padding: 12px 25px;
    font-size: 16px;
  }
}
</style>
