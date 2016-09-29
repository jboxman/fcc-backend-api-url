// http://stackoverflow.com/questions/742013/how-to-code-a-url-shortener

const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split('');

export function bijectiveEncode(i) {
  if(i == 0)
    return ALPHABET[0];
  let s = [];
  let base = ALPHABET.length;
  while(i > 0) {
    console.log(i % base);
    s.push(ALPHABET[i % base]);
    i = (i / base);
  }
  //console.log(s);
  return s.reverse().join('');
}
export function bijectiveDecode(s) {
  let i = 0;
  let base = ALPHABET.length;
  s.split('').forEach(c => {i = i * base + ALPHABET.indexOf(c)});
  return i;
}

/*
ALPHABET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(//)
  # make your own alphabet using:
  # (('a'..'z').to_a + ('A'..'Z').to_a + (0..9).to_a).shuffle.join

def bijective_encode(i)
  # from http://refactormycode.com/codes/125-base-62-encoding
  # with only minor modification
  return ALPHABET[0] if i == 0
  s = ''
  base = ALPHABET.length
  while i > 0
    s << ALPHABET[i.modulo(base)]
    i /= base
  end
  s.reverse
end

def bijective_decode(s)
  # based on base2dec() in Tcl translation
  # at http://rosettacode.org/wiki/Non-decimal_radices/Convert#Ruby
  i = 0
  base = ALPHABET.length
  s.each_char { |c| i = i * base + ALPHABET.index(c) }
  i
end
*/

