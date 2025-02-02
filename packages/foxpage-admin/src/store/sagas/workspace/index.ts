import { fork } from 'redux-saga/effects';

import dynamics from './dynamics/dynamics';
import applications from './applications';
import projects from './projects';

export default function* rootSaga() {
  yield fork(applications);
  yield fork(dynamics);
  yield fork(projects);
}
