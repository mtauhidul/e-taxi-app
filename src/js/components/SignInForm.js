import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { TextField, Button, withStyles, Snackbar } from 'material-ui';
import { isEmpty } from 'lodash';
import { signIn } from '../actions/signIn';
import validateRequiredFields from '../helpers/formHelper';
import '../../styles/css/components/SignInForm.css';

const styles = {
  SignInFormButton: {
    marginTop: 20
  }
};

class SignInForm extends React.Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
    this.state = {
      inputs: {
        username: '',
        password: ''
      },
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({
      inputs: {
        ...this.state.inputs,
        [e.target.name]: e.target.value
      }
    });
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ errors: {} });

    if (this.isValid()) {
      this.props.signIn(this.state.inputs)
        .then(() => {
          this.props.history.push('/dashboard');
        })
        .catch(() => this.setState({ errors: { credentials: 'Wprowadzono niepoprawne dane logowania' } }));
      // this.props.signUp(this.state.inputs)
      //   .then((action) => {
      //     this.props.history.push('/confirmation', {
      //       verificationEmail: action.payload.email,
      //       token: action.payload.token
      //     });
      //   });
    }
  }

  isValid() {
    const { errors, isValid } = this.validateInputs(this.state.inputs);

    if (!isValid) {
      this.setState({ errors });
    }

    return isValid;
  }

  validateInputs(data) {
    const errors = validateRequiredFields(data);

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }

  render() {
    const { errors } = this.state;

    return (
      <form className="login-form" onSubmit={this.onSubmit} noValidate autoComplete="off">
        <p className="login-form__title">
          KorzystajÄ…c z poniÅ¼szego formularza moÅ¼esz zalogowaÄ‡ siÄ™ jako pasaÅ¼er lub kierowca.
        </p>
        <TextField
          id="username"
          name="username"
          label="Nazwa uÅ¼ytkownika lub e-mail"
          margin="normal"
          fullWidth
          onChange={this.onChange}
          error={!!errors.username || !!errors.credentials}
          helperText={errors.username}
        />
        <TextField
          id="password"
          name="password"
          label="HasÅ‚o"
          margin="normal"
          type="password"
          fullWidth
          onChange={this.onChange}
          error={!!errors.password || !!errors.credentials}
          helperText={errors.password}
        />
        <div className="login-form__buttons-wrapper">
          <Button className={this.classes.SignInFormButton} raised color="primary" type="submit">
            Zaloguj siÄ™
          </Button>
          <Button
            component={Link}
            to="/register"
            className={this.classes.SignInFormButton}
            raised
            color="default"
          >
            UtwÃ³rz konto
          </Button>
          <a href="/" className="login-form__forgot-password-link">Nie pamiÄ™tasz hasÅ‚a?</a>
        </div>

        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
          open={!!this.state.errors.credentials}
          autoHideDuration={6000}
          SnackbarContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={<span id="message-id">{this.state.errors.credentials}</span>}
        />
      </form>
    );
  }
}

SignInForm = connect(state => state, { signIn })(SignInForm);

export default withStyles(styles)(SignInForm);
