## Guidelines

Bla, bla, bla.

## How to contribute code

Since muffin consists of two parts (the [kit][1] and the [core system][2]), there are multiple ways to contribute to it. To determine which one is the right for you, the only thing you need to do is decide which of the following scenarios fits yours the best:

I'd like to make changes to...

1. [the core system][3]
2. [the kit][4]
3. [both the kit and the core system][5]

**Important:** Before executing one of the steps, please make sure that you have all of muffin's [requirements](https://github.com/leo/muffin#requirements) installed.

### Contribute to the core

Clone this repo

```shell
git clone git://github.com/leo/muffin.git
cd muffin
```

Install all dependencies

```shell
npm install
```

You made it! Now you only need to start the app and it will be running here: [http://localhost:2000/muffin](http://localhost:2000/muffin).

```shell
npm start
```

### Contribute to the kit

Clone the repo

```shell
git clone git://github.com/leo/generator-muffin.git
cd generator-muffin
```

Install all other dependencies recursively

```shell
npm install
cd kit && npm install
```

Link generator to global scope

```shell
npm link
```

Now you'll be able to run `yo muffin`. However, this will create a new copy of the kit and since you want to contribute to the kit itself (not a copy of it), you need to run the kit that's already part of the repo:

```shell
cd kit
npm start
```

You're done! Executing the above command will immediately start muffin and you'll be able to make changes.

### Contribute to everything

Firstly, finish both [this][3] and [this][4]. But make sure to not run `npm start` on any of them. If you have, simply stop all of the running instances by using <kbd>ctrl</kbd> + <kbd>C</kbd>.

After you're done, move to the directory that core system and link it to the global module directory:

```shell
cd muffin
npm link
```

Now move to the directory that contains the kit and link the core system into the local dependencies of the kit:

```shell
cd generator-muffin/kit
npm link muffin
```

All in all, this basically does the following: If you start running the muffin from the kit using `npm start`, node won't use the instance of muffin that you've installed from npm. Rather than that, it will simply assume that your local `muffin` repository contains the core system.

Now go ahead and run muffin from the kit. If you're already in `generator-muffin/kit`, run the following:

```shell
npm start
```

[1]: https://github.com/leo/generator-muffin
[2]: https://github.com/leo/muffin
[3]: #contribute-to-the-core
[4]: #contribute-to-the-kit
[5]: #contribute-to-everything
