// Appwrite configuration
const APPWRITE = {
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: '685ed548003693db4ec5',
  apiKey:   'standard_3ba1605ea035dabbcf64046a7094e9418cf362eef3971d71408ae00ee72bef88034a40fd4dfd2ce72df6b306c8033b7b99deb86131b251e6455b2d2e451b779e106f10eb6a8bf1dc0185474786fdd492655b059f92179247eb9a97a45d3e2ec20b72ed66a8ed07eac47240ae7c667b9a80f923468ef66a64a1b292632a29178b',
  databases: {
    id: 'default',
    collections: {
      users: 'users',
      posts: 'posts',
      chats: 'chats'
    }
  },
  storage: {
    bucket: 'car_images'
  }
};

// Initialize Appwrite client & services
const client = new Appwrite.Client()
  .setEndpoint(APPWRITE.endpoint)
  .setProject(APPWRITE.projectId);

const account  = new Appwrite.Account(client);
const db       = new Appwrite.Databases(client);
const storage  = new Appwrite.Storage(client);
const realtime = new Appwrite.Realtime(client);
