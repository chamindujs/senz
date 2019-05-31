import React, { Component } from "react";
import {
  Container,
  Typography,
  Grid,
  Link,
  TextField,
  CssBaseline,
  Button,
  Avatar
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import { Field, reduxForm } from "redux-form";
import { withStyles } from "@material-ui/core/styles";
import { RegisterAction } from "../../_actions/auth";
import { connect } from "react-redux";

const styles = theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "80%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(5, 0, 2)
  }
});

class Register extends Component {
  renderInputError = ({ error, touched }) => {
    if (error && touched) return { error: true, message: error };
    else return { error: false, message: "" };
  };

  renderInput = ({ input, label, type, id, meta }) => {
    const { error, message } = this.renderInputError(meta);
    if (error) {
      return (
        <TextField
          {...input}
          autoComplete="off"
          variant="outlined"
          fullWidth
          type={type}
          id={id}
          error
          label={message}
        />
      );
    } else {
      return (
        <TextField
          {...input}
          autoComplete="off"
          variant="outlined"
          fullWidth
          type={type}
          id={id}
          required
          label={label}
        />
      );
    }
  };
  submit = ({ firstName, lastName, email, password }) => {
    const name = `${firstName} ${lastName}`;
    this.props.RegisterAction({ name, email, password }, this.props.history);
  };
  render() {
    const { classes } = this.props;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form
            className={classes.form}
            onSubmit={this.props.handleSubmit(this.submit)}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Field
                  name="firstName"
                  id="firstName"
                  label="First Name"
                  component={this.renderInput}
                  type="text"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  name="lastName"
                  id="lastName"
                  label="Last Name"
                  component={this.renderInput}
                  type="text"
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="email"
                  id="email"
                  label="Email Address"
                  component={this.renderInput}
                  type="text"
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="password"
                  id="password"
                  label="Password"
                  type="password"
                  component={this.renderInput}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="cPassword"
                  id="cPassword"
                  label="Confirm Password"
                  type="password"
                  component={this.renderInput}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
}

const emailValid = email => {
  const pattern = new RegExp(
    "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$"
  );
  return pattern.test(email);
};

const passwordValid = password => {
  if (password === undefined) return false;
  return password.length > 4;
};

const validate = ({ firstName, lastName, email, password, cPassword }) => {
  const errors = {};
  if (!firstName) errors.firstName = "Not given";
  if (!lastName) errors.lastName = "Not given";
  if (!emailValid(email)) errors.email = "Email not valid";
  if (!passwordValid(password)) errors.password = "Password too short";
  if (cPassword !== password) errors.cPassword = "Password don't match";
  return errors;
};

const registerForm = reduxForm({
  form: "register",
  validate: validate
})(withStyles(styles, { withTheme: true })(Register));

export default connect(
  null,
  { RegisterAction }
)(registerForm);
