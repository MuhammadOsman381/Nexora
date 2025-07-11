class Helpers {
    static localhost: string = 'localhost:5000';
    static server: string = '1.1.1.1.1:4000';
    static basePath: string = `http://${this.localhost}`;
    static apiUrl: string = `${this.basePath}/api/`;
    static secretKey: string = '3434774438';
}

export default Helpers;