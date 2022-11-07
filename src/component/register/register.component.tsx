import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEmailRequest,
  registerUserRequest,
  saveEmailUser,
} from '../../redux/actions/UserAction';
import { UserState, UserData } from '../../redux/types/UserTypes';
import { RootState } from '../../redux/reducers';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './register.styles.scss';
import OTPRegister from './otp-register.component';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    email: yup
      .string()
      .trim()
      .matches(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Email không hợp lệ'
      ),
    password: yup.string().min(8, 'Mật khẩu phải trên 8 kí tự'),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  // const aEmail = { email: email };
  // useEffect(() => {
  //   dispatch(searchUserExistRequest({ email }));
  // }, []);

  const [pass, setPass] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [repeatPass, setRepeatPass] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [countDown, setCountDown] = useState<Boolean>(false);

  const user: UserState = useSelector((state: RootState) => state.user);
  const { error } = user;
  const { userExist }: any = useSelector<RootState>((state) => state.user);

  const onSubmit = async (data: UserData) => {
    // if (errors.email?.message) {
    //   setErrorMessage('Email không hợp lệ');
    // }

    const flag = {
      email: data.email,
    };

    if (pass === repeatPass) {
      dispatch(
        registerUserRequest(data, () => {
          dispatch(getEmailRequest(flag));
          dispatch(saveEmailUser(flag));
          setCountDown(true);
        })
      );
    } else {
      setErrorMessage('Mật khẩu không khớp');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  return (
    <div className="container">
      <div className="register">
        {countDown ? (
          <OTPRegister password={pass}></OTPRegister>
        ) : (
          <>
            <div className="register_title">Đăng kí tài khoản HiChat</div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="register_form_input">
                <input
                  type="text"
                  placeholder="Họ và tên"
                  required
                  {...register('name')}
                ></input>
              </div>
              <div className="register_form_input">
                <input
                  type="text"
                  placeholder="Email"
                  {...register('email')}
                  onChange={(e: FormEvent<HTMLInputElement>) =>
                    setEmail(e.currentTarget.value)
                  }
                ></input>

                {errors ? (
                  <div className="error">
                    {errors.email?.message ? `${errors.email?.message}` : ''}
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div className="register_form_input">
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  {...register('password')}
                  onChange={(e: FormEvent<HTMLInputElement>) =>
                    setPass(e.currentTarget.value)
                  }
                ></input>
                {errors.password ? (
                  <div className="error">
                    {errors.password?.message
                      ? `${errors.password?.message}`
                      : ''}
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div className="register_form_input">
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  onChange={(e: FormEvent<HTMLInputElement>) =>
                    setRepeatPass(e.currentTarget.value)
                  }
                ></input>

                {errorMessage ? (
                  <div className="error">{errorMessage}</div>
                ) : (
                  ''
                )}
                {error ? <div className="error">{error}</div> : ''}
              </div>

              <button className="btn">Đăng kí</button>

              <div className="toLogin">
                <Link to="/login">Đăng nhập!</Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;