import Mock from 'mockjs';

const Users = Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.cname(),
    organ:{
        name:Mock.mock('@county(true)')
    },
    roles:[
        {
            name:Mock.Random.date(),
        }
    ]
});


export { Users };