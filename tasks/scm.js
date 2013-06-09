module.exports = function(grunt)
{

	'use strict';

	grunt.registerMultiTask('scm', 'use source control repositories', function()
	{

		function git(self, done)
		{
			var fs = require('fs');
			var childProcess = require('child_process');
			self.branch = self.branch || 'origin/master';

			function afterClone()
			{
				console.log('changing dir to ' + self.data.target);
				process.chdir(self.data.target);
				console.log(self.data.type + ' fetch');
				var childPull = childProcess.spawn(self.data.type, ['fetch'],
				{
					stdio: 'inherit'
				});
				childPull.on('exit', function()
				{
					console.log(self.data.type + ' checkout ' + self.branch);
					var childUpdate = childProcess.spawn(self.data.type, ['checkout', self.branch],
					{
						stdio: 'inherit'
					});
					childUpdate.on('exit', function()
					{
						console.log(self.data.type + ' reset ' + self.branch /*+ ' --hard'*/ );
						var childReset = childProcess.spawn(self.data.type, ['reset', self.branch /*, '--hard'*/ ],
						{
							stdio: 'inherit'
						});
						childReset.on('exit', function()
						{
							done();
						});
					});
				});
			}

			if (fs.existsSync(self.data.target))
			{
				afterClone();
			}
			else
			{
				var args = [];
				args.push('clone');
				args.push(self.data.url);
				args.push(self.data.target);

				console.log(self.data.type + ' ' + args.join(' '));

				var child = childProcess.spawn(self.data.type, args,
				{
					stdio: 'inherit'
				});

				child.on('exit', afterClone);
			}

		}

		function hg(self, done)
		{
			var fs = require('fs');
			var childProcess = require('child_process');
			self.branch = self.branch || 'default';

			function afterClone()
			{
				var cwd = process.cwd();
				process.chdir(self.data.target);
				console.log(self.data.type + ' pull');
				var childPull = childProcess.spawn(self.data.type, ['pull'],
				{
					stdio: 'inherit'
				});
				childPull.on('exit', function()
				{
					console.log(self.data.type + ' update ' + self.branch + ' -C');
					var childUpdate = childProcess.spawn(self.data.type, ['update', /*'-r',*/ self.branch /*, '-C'*/ ],
					{
						stdio: 'inherit'
					});
					childUpdate.on('exit', function()
					{
						process.chdir(cwd);
						done();
					});
				});
			}

			if (fs.existsSync(self.data.target))
			{
				afterClone();
			}
			else
			{
				var args = [];
				args.push('clone');
				args.push(self.data.url);
				args.push(self.data.target);

				console.log(self.data.type + ' ' + args.join(' '));

				var child = childProcess.spawn(self.data.type, args,
				{
					stdio: 'inherit'
				});

				child.on('exit', afterClone);
			}

		}


		var done = this.async();

		var options = this.options(
		{
			type: 'git',
			url: null,
			target: null,
			branch: null
		});
		this.data.type = this.data.type || options.type;
		this.data.url = this.data.url || options.url;
		this.data.target = this.data.target || options.target;
		this.data.branch = this.data.branch || options.branch;

		var implementations =
		{
			git: git,
			hg: hg
		};
		var fn = function()
		{
			throw new Error('unsupported scm type');
		};
		if (implementations[this.data.type])
		{
			fn = implementations[this.data.type];
		}

		grunt.log.subhead('Running ' + this.data.type + ' pull ' + this.target + '...');

		if (this.data.url)
		{
			if (this.data.target)
			{
				fn(this, done);
			}
			else
			{
				grunt.log.error('No scm target specified');
				done(false);
			}
		}
		else
		{
			grunt.log.error('No scm url specified');
			done(false);
		}
	});

};