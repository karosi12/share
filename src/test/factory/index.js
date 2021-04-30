import FactoryGirl from 'factory-girl';
import User from '../../model/user';
import Post from '../../model/post';
import faker from 'faker';


FactoryGirl.define('User', User, {
    fullName: faker.name.findName(),
    email: 'wajafev754@animex98.com',
    password: 'password1234!'
});

FactoryGirl.define('Post', Post, {
    post: faker.lorem.sentences()
});

export default FactoryGirl