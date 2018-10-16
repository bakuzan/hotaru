import { generateUniqueId } from '@/utils';

const INFO = 'info';
const SUCCESS = 'success';
const ERROR = 'error';
const WARNING = 'warning';

class AlertService {
  constructor() {
    this.target = null;
  }

  register(comp) {
    this.target = comp;
  }

  __pushAlert(alert) {
    this.target.alerts.push(alert);
  }

  send(obj, type = INFO) {
    this.__pushAlert({
      id: generateUniqueId(),
      type,
      message: '',
      detail: '',
      ...obj
    });
  }

  sendInfo(obj) {
    this.send(obj);
  }
  sendWarning(obj) {
    this.send(obj, WARNING);
  }
  sendSuccess(obj) {
    this.send(obj, SUCCESS);
  }
  sendError(obj) {
    this.send(obj, ERROR);
    console.log('%c Alert Service Error Sent >', 'color: brickred', obj);
  }
}

const AS = new AlertService();
export default AS;
