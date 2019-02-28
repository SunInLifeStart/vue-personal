import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Users } from './data/user';


export default {
    /**
     * mock bootstrap
     */
    bootstrap() {
        let mock = new MockAdapter(axios);
        // mock success request
        mock.onGet('/api/admin/user/userInfo').reply(200, Users);

    }
};