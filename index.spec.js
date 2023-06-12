const {globToRegex} = require('./index');

describe('globToRegex', () => {
    // https://en.wikipedia.org/wiki/Glob_(programming)
    test('matches any number of any characters including none', () => {
        let regex = globToRegex('Law*');
        expect(regex.test('Law')).toBe(true);
        expect(regex.test('Laws')).toBe(true);
        expect(regex.test('Lawyer')).toBe(true);
        expect(regex.test('GrokLaw')).toBe(false);
        expect(regex.test('La')).toBe(false);
        expect(regex.test('aw')).toBe(false);

        regex = globToRegex('*Law*');
        expect(regex.test('Law')).toBe(true);
        expect(regex.test('GrokLaw')).toBe(true);
        expect(regex.test('Lawyer')).toBe(true);
        expect(regex.test('La')).toBe(false);
        expect(regex.test('aw')).toBe(false);
    })
    test('matches any single character', () => {
        let regex = globToRegex('?at');
        expect(regex.test('Cat')).toBe(true);
        expect(regex.test('cat')).toBe(true);
        expect(regex.test('Bat')).toBe(true);
        expect(regex.test('bat')).toBe(true);
        expect(regex.test('at')).toBe(false);
    })
    test('matches one character given in the bracket', () => {
        let regex = globToRegex('[CB]at');
        expect(regex.test('Cat')).toBe(true);
        expect(regex.test('Bat')).toBe(true);
        expect(regex.test('cat')).toBe(false);
        expect(regex.test('bat')).toBe(false);
        expect(regex.test('CBat')).toBe(false);
    })
    test('matches one character from the (locale-dependent) range given in the bracket', () => {
        let regex = globToRegex('Letter[0-9]');
        expect(regex.test('Letter0')).toBe(true);
        expect(regex.test('Letter2')).toBe(true);
        expect(regex.test('Letter3')).toBe(true);
        expect(regex.test('Letter9')).toBe(true);
        expect(regex.test('Letters')).toBe(false);
        expect(regex.test('Letter')).toBe(false);
        expect(regex.test('Letter10')).toBe(false);
    })
    test('Unix Like: matches one character that is not given in the bracket', () => {
        let regex = globToRegex('[!C]at');
        expect(regex.test('Bat')).toBe(true);
        expect(regex.test('bat')).toBe(true);
        expect(regex.test('cat')).toBe(true);
        expect(regex.test('Cat')).toBe(false);
    })
    test('Unix Like: matches one character that is not from the range given in the bracket', () => {
        let regex = globToRegex('Letter[!3-5]');
        expect(regex.test('Letter0')).toBe(true);
        expect(regex.test('Letter1')).toBe(true);
        expect(regex.test('Letter6')).toBe(true);
        expect(regex.test('Letter7')).toBe(true);
        expect(regex.test('Letter3')).toBe(false);
        expect(regex.test('Letter4')).toBe(false);
        expect(regex.test('Letter5')).toBe(false);
        expect(regex.test('Letterxx')).toBe(false);
    })
    // -----
    test('range with a single character', () => {
        const globPattern = '[abc].txt';
        const regex = globToRegex(globPattern);
        expect(regex.test('a.txt')).toBe(true);
        expect(regex.test('b.txt')).toBe(true);
        expect(regex.test('c.txt')).toBe(true);
        expect(regex.test('foo.txt')).toBe(false);
        expect(regex.test('bar.txt')).toBe(false);
        expect(regex.test('cat.txt')).toBe(false);
    })
    test('range with a mutlpile character', () => {
        const globPattern = '[a-c].txt';
        const regex = globToRegex(globPattern);
        expect(regex.test('a.txt')).toBe(true);
        expect(regex.test('b.txt')).toBe(true);
        expect(regex.test('c.txt')).toBe(true);
        expect(regex.test('d.txt')).toBe(false);
        expect(regex.test('e.txt')).toBe(false);
        expect(regex.test('aaaa.txt')).toBe(false);
    })
    test('Complex directory and file extension match', () => {
        const globPattern = '**/backup/**/month/[0-9][0-9]/**/backup?.{json|bson}';
        const regex = globToRegex(globPattern);

        expect(regex.test('a/d/c/d/backup/year/23/month/06/day/01/backup1.json')).toBe(true);
        expect(regex.test('a/d/c/d/backup/year/23/month/07/day/12/backup2.bson')).toBe(true);
        expect(regex.test('a/d/c/d/backup/year/23/month/07/day/12/backup99.json')).toBe(false);
        expect(regex.test('a/d/c/d/backup/year/23/month/07/day/12/backup99.bson')).toBe(false);
    });
    test.skip('Simple file extension match', () => {
        const globPattern = '*.txt';
        const regex = globToRegex(globPattern);

        expect(regex.test('file.txt')).toBe(true);
        expect(regex.test('file.doc')).toBe(false);
        expect(regex.test('dir/file.txt')).toBe(false);
    });
    test('Match files with any extension', () => {
        const globPattern = 'file.*';
        const regex = globToRegex(globPattern);
        expect(regex.test('file.txt')).toBe(true);
        expect(regex.test('file.doc')).toBe(true);
        expect(regex.test('file')).toBe(false);
        expect(regex.test('dir/file.txt')).toBe(false);
        expect(regex.test('foo.txt.bak')).toBe(false);
        expect(regex.test('foo.txt/bar.txt')).toBe(false);
    });
    test('Match multiple characters with "?"', () => {
        const globPattern = 'fi?e.txt';
        const regex = globToRegex(globPattern);

        expect(regex.test('file.txt')).toBe(true);
        expect(regex.test('five.txt')).toBe(true);
        expect(regex.test('fire.txt')).toBe(true);
        expect(regex.test('fi.txt')).toBe(false);
        expect(regex.test('dir/file.txt')).toBe(false);
    });
    test('Escape special characters', () => {
        let regex = globToRegex('file?.txt');
        expect(regex.test('file?.txt')).toBe(true);
        expect(regex.test('file1.txt')).toBe(true);
        expect(regex.test('fileX.txt')).toBe(true);
        expect(regex.test('fileXX.txt')).toBe(false);

        regex = globToRegex('?.txt');
        expect(regex.test('a.txt')).toBe(true);
        expect(regex.test('foo.txt')).toBe(false);
    });
    test('Match directories', () => {
        const globPattern = 'dir/*';
        const regex = globToRegex(globPattern);

        expect(regex.test('dir/fileA.txt')).toBe(true);
        expect(regex.test('dir/fileB.txt')).toBe(true);
        expect(regex.test('dir/subdir/')).toBe(false);
        expect(regex.test('dir/subdir/file.txt')).toBe(false);
        expect(regex.test('file.txt')).toBe(false);
    });
    test('Match sub directories', () => {
        const globPattern = 'dir/**';
        const regexPattern = globToRegex(globPattern);
        const regex = new RegExp(regexPattern);
        expect(regex.test('dir/fileA.txt')).toBe(true);
        expect(regex.test('dir/fileB.txt')).toBe(true);
        expect(regex.test('dir/subdir/fileA.txt')).toBe(true);
        expect(regex.test('dir/subdir/fileB.txt')).toBe(true);
        expect(regex.test('dir/subdir/subdir/fileA.txt')).toBe(true);
        expect(regex.test('dir/subdir/subdir/fileB.txt')).toBe(true);
        expect(regex.test('fileA.txt')).toBe(false);
        expect(regex.test('fileB.txt')).toBe(false);
    });
    test('Match sub directories with interruption in depth', () => {
        const globPattern = 'dir/**/[0-9][0-9][0-9]/**/*.txt';
        const regex = globToRegex(globPattern);

        expect(regex.test('dir/fileA.txt')).toBe(false);
        expect(regex.test('dir/fileB.txt')).toBe(false);
        expect(regex.test('dir/subdir/000/fileA.txt')).toBe(false);
        expect(regex.test('dir/subdir/111/fileA.txt')).toBe(false);
        expect(regex.test('dir/subdir/999/fileA.txt')).toBe(false);
        expect(regex.test('dir/subdir/090/fileA.txt')).toBe(false);

        expect(regex.test('dir/subdir/000/subdir/fileA.txt')).toBe(true);
        expect(regex.test('dir/subdir/111/subdir/fileA.txt')).toBe(true);
        expect(regex.test('dir/subdir/999/subdir/fileA.txt')).toBe(true);
        expect(regex.test('dir/subdir/090/subdir/fileA.txt')).toBe(true);

        expect(regex.test('dir/subdir/subdir/000/subdir/fileA.txt')).toBe(true);
        expect(regex.test('dir/subdir/subdir/111/subdir/fileA.txt')).toBe(true);
        expect(regex.test('dir/subdir/subdir/999/subdir/fileA.txt')).toBe(true);
        expect(regex.test('dir/subdir/subdir/090/subdir/fileA.txt')).toBe(true);

        expect(regex.test('dir/subdir/subdir/000/subdir/subdir/fileA.txt')).toBe(true);
        expect(regex.test('dir/subdir/subdir/111/subdir/subdir/fileA.txt')).toBe(true);
        expect(regex.test('dir/subdir/subdir/999/subdir/subdir/fileA.txt')).toBe(true);
        expect(regex.test('dir/subdir/subdir/090/subdir/subdir/fileA.txt')).toBe(true);
        // expect(regex.test('dir/subdir/fileB.txt')).toBe(true);
        // expect(regex.test('dir/subdir/subdir/fileA.txt')).toBe(true);
        // expect(regex.test('dir/subdir/subdir/fileB.txt')).toBe(true);
        // expect(regex.test('fileA.txt')).toBe(false);
        // expect(regex.test('fileB.txt')).toBe(false);
    });
});
