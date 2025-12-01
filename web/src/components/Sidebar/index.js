import { Link, withRouter } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Sidebar = (props) => {
  return (
    <div className="sidebar col-2 h-100">
      <img alt="logo" src={logo} className="img-fluid px-3 py-4" />
      <ul>
        <li>
          <Link
            to="/"
            className={props.location.pathname === '/' ? 'active' : ''}
          >
            <span className="mdi mdi-calendar-check"></span>
            <span>Agendamentos</span>
          </Link>
        </li>
        <li>
          <Link
            to="/clientes"
            className={props.location.pathname === '/clientes' ? 'active' : ''}
          >
            <span className="mdi mdi-account-multiple"></span>
            <span>Clientes</span>
          </Link>
        </li>
        <li>
          <Link
            to="/colaboradores"
            className={
              props.location.pathname === '/colaboradores' ? 'active' : ''
            }
          >
            <span className="mdi mdi-card-account-details-outline"></span>
            <span>Colaboradores</span>
          </Link>
        </li>
        <li>
          <Link
            to="/servicos-produtos"
            className={
              props.location.pathname === '/servicos-produtos' ? 'active' : ''
            }
          >
            <span className="mdi mdi-auto-fix"></span>
            <span>Serviços</span>
          </Link>
        </li>
        <li>
          <Link
            to="/horarios-atendimento"
            className={
              props.location.pathname === '/horarios-atendimento'
                ? 'active'
                : ''
            }
          >
            <span className="mdi mdi-clock-check-outline"></span>
            <span>Horarios</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default withRouter(Sidebar);
