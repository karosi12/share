import FactoryGirl from 'factory-girl';
import User from '../../model/user';
import faker from 'faker';


FactoryGirl.define('User', User, {
    fullName: faker.name.findName(),
    email: 'adeyemi@example.com',
    password: 'password1234!'
});

export default FactoryGirl