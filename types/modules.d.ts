// Declare modules without types
declare module 'next-compose-plugins';
declare module 'next-with-less';
declare module 'next-pwa/cache';
declare module 'next-intl/plugin';

// Define the structure of `next-compose-plugins`
declare module 'next-compose-plugins' {
    function withPlugins(plugins: any[]): any;
    export = withPlugins;
}

// Optionally, you can declare a similar structure for `next-with-less`
// and any other modules that need explicit types
declare module 'next-with-less' {
    const withLess: any;
    export = withLess;
}
