ï»¿export interface Quote {
  text: string;
  author?: string;
}

export const QUOTES: Quote[] = [
  // On life & living
  { text: "The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate, to have it make some difference that you have lived and lived well.", author: "Ralph Waldo Emerson" },
  { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
  { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius" },
  { text: "To live is the rarest thing in the world. Most people exist, that is all.", author: "Oscar Wilde" },
  { text: "The good life is one inspired by love and guided by knowledge.", author: "Bertrand Russell" },
  { text: "Life is not measured by the number of breaths we take, but by the moments that take our breath away.", author: "Maya Angelou" },
  { text: "We do not remember days, we remember moments.", author: "Cesare Pavese" },
  { text: "Life shrinks or expands in proportion to one's courage.", author: "AnaÃ¯s Nin" },
  { text: "The big lesson in life is never be scared of anyone or anything.", author: "Frank Sinatra" },
  { text: "Life is short, and it is here to be lived.", author: "Kate Winslet" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The most important thing is to enjoy your life â to be happy â it's all that matters.", author: "Audrey Hepburn" },

  // On courage & fear
  { text: "Courage is not the absence of fear, but the judgment that something else is more important than fear.", author: "Ambrose Redmoon" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "You gain strength, courage, and confidence by every experience in which you really stop to look fear in the face.", author: "Eleanor Roosevelt" },
  { text: "Do one thing every day that scares you.", author: "Eleanor Roosevelt" },
  { text: "Courage is resistance to fear, mastery of fear â not absence of fear.", author: "Mark Twain" },
  { text: "Fear is the thief of dreams.", author: "Brian Krans" },
  { text: "The cave you fear to enter holds the treasure you seek.", author: "Joseph Campbell" },
  { text: "I learned that courage was not the absence of fear, but the triumph over it.", author: "Nelson Mandela" },
  { text: "He who is not courageous enough to take risks will accomplish nothing in life.", author: "Muhammad Ali" },

  // On failure & resilience
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.", author: "Thomas Edison" },
  { text: "You may encounter many defeats, but you must not be defeated.", author: "Maya Angelou" },
  { text: "The only real mistake is the one from which we learn nothing.", author: "Henry Ford" },
  { text: "Failure is the condiment that gives success its flavor.", author: "Truman Capote" },
  { text: "Rock bottom became the solid foundation on which I rebuilt my life.", author: "J.K. Rowling" },
  { text: "The phoenix must burn to emerge.", author: "Janet Fitch" },

  // On happiness
  { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
  { text: "The happiest people don't have the best of everything, they make the best of everything.", author: "Unknown" },
  { text: "Happiness depends upon ourselves.", author: "Aristotle" },
  { text: "Count your age by friends, not years. Count your life by smiles, not tears.", author: "John Lennon" },
  { text: "For every minute you are angry you lose sixty seconds of happiness.", author: "Ralph Waldo Emerson" },
  { text: "Happiness is when what you think, what you say, and what you do are in harmony.", author: "Mahatma Gandhi" },
  { text: "The secret of happiness is not in doing what one likes, but in liking what one does.", author: "James M. Barrie" },
  { text: "Happiness is a warm puppy.", author: "Charles M. Schulz" },
  { text: "There is only one way to happiness and that is to cease worrying about things which are beyond the power of our will.", author: "Epictetus" },
  { text: "Happiness is not a goal; it is a by-product.", author: "Eleanor Roosevelt" },

  // On knowledge & learning
  { text: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats" },
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" },
  { text: "It is not that I'm so smart. But I stay with the questions much longer.", author: "Albert Einstein" },
  { text: "The more I read, the more I acquire, the more certain I am that I know nothing.", author: "Voltaire" },
  { text: "Real learning comes about when the competitive spirit has ceased.", author: "Jiddu Krishnamurti" },

  // On change & growth
  { text: "The only way to make sense out of change is to plunge into it, move with it, and join the dance.", author: "Alan Watts" },
  { text: "Change is the law of life. And those who look only to the past or present are certain to miss the future.", author: "John F. Kennedy" },
  { text: "If you don't like something, change it. If you can't change it, change your attitude.", author: "Maya Angelou" },
  { text: "Progress is impossible without change, and those who cannot change their minds cannot change anything.", author: "George Bernard Shaw" },
  { text: "The measure of intelligence is the ability to change.", author: "Albert Einstein" },
  { text: "It is not the strongest of the species that survive, nor the most intelligent, but the one most responsive to change.", author: "Charles Darwin" },
  { text: "They must often change, who would be constant in happiness or wisdom.", author: "Confucius" },
  { text: "All great changes are preceded by chaos.", author: "Deepak Chopra" },
  { text: "Become the change you wish to see in the world.", author: "Mahatma Gandhi" },

  // On time
  { text: "Time is what we want most, but what we use worst.", author: "William Penn" },
  { text: "Lost time is never found again.", author: "Benjamin Franklin" },
  { text: "The two most powerful warriors are patience and time.", author: "Leo Tolstoy" },
  { text: "Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.", author: "Bill Keane" },
  { text: "Time flies over us, but leaves its shadow behind.", author: "Nathaniel Hawthorne" },
  { text: "Time is the most valuable thing a man can spend.", author: "Theophrastus" },
  { text: "Better three hours too soon than a minute too late.", author: "William Shakespeare" },
  { text: "The time is always right to do what is right.", author: "Martin Luther King Jr." },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },

  // On love & relationships
  { text: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" },
  { text: "We accept the love we think we deserve.", author: "Stephen Chbosky" },
  { text: "Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day.", author: "Unknown" },
  { text: "The greatest happiness of life is the conviction that we are loved; loved for ourselves, or rather, loved in spite of ourselves.", author: "Victor Hugo" },
  { text: "To love and be loved is to feel the sun from both sides.", author: "David Viscott" },
  { text: "Love all, trust a few, do wrong to none.", author: "William Shakespeare" },
  { text: "The best love is the kind that awakens the soul; that makes us reach for more, that plants the fire in our hearts and brings peace to our minds.", author: "Nicholas Sparks" },
  { text: "Where there is love there is life.", author: "Mahatma Gandhi" },
  { text: "You don't love someone for their looks, or their clothes, or for their fancy car, but because they sing a song only you can hear.", author: "Oscar Wilde" },

  // On friendship
  { text: "A real friend is one who walks in when the rest of the world walks out.", author: "Walter Winchell" },
  { text: "Friendship is born at that moment when one person says to another, 'What! You too? I thought I was the only one.'", author: "C.S. Lewis" },
  { text: "True friendship comes when the silence between two people is comfortable.", author: "David Tyson" },
  { text: "A friend is someone who gives you total freedom to be yourself.", author: "Jim Morrison" },
  { text: "Good friends are like stars. You don't always see them, but you know they're always there.", author: "Unknown" },
  { text: "In the cookie of life, friends are the chocolate chips.", author: "Salman Rushdie" },
  { text: "It's not about whom you've known the longest, it's about who came and never left your side.", author: "Unknown" },

  // On success
  { text: "The secret of success is to do the common thing uncommonly well.", author: "John D. Rockefeller Jr." },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { text: "Don't aim for success if you want it; just do what you love and believe in, and it will come naturally.", author: "David Frost" },
  { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
  { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
  { text: "Success is liking yourself, liking what you do, and liking how you do it.", author: "Maya Angelou" },
  { text: "The road to success and the road to failure are almost exactly the same.", author: "Colin R. Davis" },
  { text: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
  { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
  { text: "If you are not willing to risk the usual, you will have to settle for the ordinary.", author: "Jim Rohn" },

  // On creativity & art
  { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
  { text: "You can't use up creativity. The more you use, the more you have.", author: "Maya Angelou" },
  { text: "Every artist was first an amateur.", author: "Ralph Waldo Emerson" },
  { text: "Art enables us to find ourselves and lose ourselves at the same time.", author: "Thomas Merton" },
  { text: "The purpose of art is washing the dust of daily life off our souls.", author: "Pablo Picasso" },
  { text: "Creativity takes courage.", author: "Henri Matisse" },
  { text: "An artist is not paid for his labor but for his vision.", author: "James McNeill Whistler" },
  { text: "Art is not what you see, but what you make others see.", author: "Edgar Degas" },
  { text: "The painter has the universe in his mind and hands.", author: "Leonardo da Vinci" },

  // On nature & simplicity
  { text: "In every walk with nature, one receives far more than he seeks.", author: "John Muir" },
  { text: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu" },
  { text: "Look deep into nature, and then you will understand everything better.", author: "Albert Einstein" },
  { text: "Adopt the pace of nature: her secret is patience.", author: "Ralph Waldo Emerson" },
  { text: "The clearest way into the universe is through a forest wilderness.", author: "John Muir" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "The ability to simplify means to eliminate the unnecessary so that the necessary may speak.", author: "Hans Hofmann" },

  // On wisdom
  { text: "The wisest mind has something yet to learn.", author: "George Santayana" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
  { text: "Wonder is the beginning of wisdom.", author: "Socrates" },
  { text: "Before enlightenment, chop wood, carry water. After enlightenment, chop wood, carry water.", author: "Zen Proverb" },
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
  { text: "A wise man can learn more from a foolish question than a fool can learn from a wise answer.", author: "Bruce Lee" },
  { text: "Science is organized knowledge. Wisdom is organized life.", author: "Immanuel Kant" },
  { text: "In seeking wisdom, the first step is silence.", author: "Solomon Ibn Gabirol" },
  { text: "Wisdom is not a product of schooling but of the lifelong attempt to acquire it.", author: "Albert Einstein" },

  // On silence & solitude
  { text: "Silence is a source of great strength.", author: "Lao Tzu" },
  { text: "In the attitude of silence the soul finds the path in a clearer light.", author: "Mahatma Gandhi" },
  { text: "Silence is the sleep that nourishes wisdom.", author: "Francis Bacon" },
  { text: "The quieter you become, the more you can hear.", author: "Ram Dass" },
  { text: "Loneliness is the poverty of self; solitude is the richness of self.", author: "May Sarton" },
  { text: "In solitude the mind gains strength and learns to lean upon itself.", author: "Laurence Sterne" },
  { text: "All of humanity's problems stem from man's inability to sit quietly in a room alone.", author: "Blaise Pascal" },

  // On hope & dreams
  { text: "Hope is being able to see that there is light despite all of the darkness.", author: "Desmond Tutu" },
  { text: "All our dreams can come true, if we have the courage to pursue them.", author: "Walt Disney" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
  { text: "The only thing that will stop you from fulfilling your dreams is you.", author: "Tom Bradley" },
  { text: "Keep your eyes on the stars and your feet on the ground.", author: "Theodore Roosevelt" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "Hope is a waking dream.", author: "Aristotle" },

  // On truth & integrity
  { text: "The truth will set you free, but first it will make you miserable.", author: "James A. Garfield" },
  { text: "Three things cannot be long hidden: the sun, the moon, and the truth.", author: "Buddha" },
  { text: "The high-minded man must care more for the truth than for what people think.", author: "Aristotle" },
  { text: "If you tell the truth, you don't have to remember anything.", author: "Mark Twain" },
  { text: "The truth is rarely pure and never simple.", author: "Oscar Wilde" },
  { text: "A half-truth is a whole lie.", author: "Yiddish Proverb" },
  { text: "Rather than love, than money, than fame, give me truth.", author: "Henry David Thoreau" },
  { text: "In a time of deceit, telling the truth is a revolutionary act.", author: "George Orwell" },

  // On kindness & compassion
  { text: "No act of kindness, no matter how small, is ever wasted.", author: "Aesop" },
  { text: "Kindness is a language which the deaf can hear and the blind can see.", author: "Mark Twain" },
  { text: "Be kind, for everyone you meet is fighting a battle you know nothing about.", author: "Wendy Mass" },
  { text: "The simplest acts of kindness are by far more powerful than a thousand heads bowing in prayer.", author: "Mahatma Gandhi" },
  { text: "Carry out a random act of kindness, with no expectation of reward.", author: "Princess Diana" },
  { text: "If you want others to be happy, practice compassion. If you want to be happy, practice compassion.", author: "Dalai Lama" },
  { text: "Too often we underestimate the power of a touch, a smile, a kind word, a listening ear.", author: "Leo Buscaglia" },
  { text: "One of the most difficult things to give away is kindness, for it is usually returned.", author: "Mark Ortman" },

  // On patience
  { text: "Patience is bitter, but its fruit is sweet.", author: "Jean-Jacques Rousseau" },
  { text: "The key to everything is patience. You get the chicken by hatching the egg, not by smashing it.", author: "Arnold H. Glasow" },
  { text: "Adopt the pace of nature: her secret is patience.", author: "Ralph Waldo Emerson" },
  { text: "Have patience. All things are difficult before they become easy.", author: "Saadi" },
  { text: "Patience, persistence and perspiration make an unbeatable combination for success.", author: "Napoleon Hill" },
  { text: "The strongest of all warriors are these two â Time and Patience.", author: "Leo Tolstoy" },

  // On words & language
  { text: "Words are, of course, the most powerful drug used by mankind.", author: "Rudyard Kipling" },
  { text: "A word after a word after a word is power.", author: "Margaret Atwood" },
  { text: "Without knowing the force of words, it is impossible to know more.", author: "Confucius" },
  { text: "One must always be careful of books, and what is inside them, for words have the power to change us.", author: "Cassandra Clare" },
  { text: "Kind words can be short and easy to speak, but their echoes are truly endless.", author: "Mother Teresa" },
  { text: "Words are like eggs dropped from great heights; you can no more call them back than ignore the mess they leave when they fall.", author: "Jodi Picoult" },
  { text: "A word is not the same with one writer as with another. One tears it from his guts. The other pulls it out of his overcoat pocket.", author: "Charles Peguy" },

  // On self
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "To thine own self be true.", author: "William Shakespeare" },
  { text: "Knowing others is wisdom, knowing yourself is enlightenment.", author: "Lao Tzu" },
  { text: "The most courageous act is still to think for yourself. Aloud.", author: "Coco Chanel" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", author: "Ralph Waldo Emerson" },
  { text: "You yourself, as much as anybody in the entire universe, deserve your love and affection.", author: "Buddha" },
  { text: "The greatest thing in the world is to know how to belong to oneself.", author: "Michel de Montaigne" },
  { text: "Trust yourself. You know more than you think you do.", author: "Benjamin Spock" },

  // On mindfulness & presence
  { text: "The present moment is the only moment available to us, and it is the door to all moments.", author: "ThÃ­ch Nháº¥t Háº¡nh" },
  { text: "If you are depressed you are living in the past. If you are anxious you are living in the future. If you are at peace you are living in the present.", author: "Lao Tzu" },
  { text: "In today's rush, we all think too much â seek too much â want too much â and forget about the joy of just being.", author: "Eckhart Tolle" },
  { text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.", author: "Buddha" },
  { text: "The secret of health for both mind and body is not to mourn for the past, nor to worry about the future, but to live the present moment wisely and earnestly.", author: "Buddha" },
  { text: "Wherever you are, be all there.", author: "Jim Elliot" },

  // On music
  { text: "Music can change the world because it can change people.", author: "Bono" },
  { text: "Without music, life would be a mistake.", author: "Friedrich Nietzsche" },
  { text: "Music is the shorthand of emotion.", author: "Leo Tolstoy" },
  { text: "Music gives a soul to the universe, wings to the mind, flight to the imagination, and life to everything.", author: "Plato" },
  { text: "After silence, that which comes nearest to expressing the inexpressible is music.", author: "Aldous Huxley" },
  { text: "One good thing about music, when it hits you, you feel no pain.", author: "Bob Marley" },

  // On books & reading
  { text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.", author: "George R.R. Martin" },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { text: "There is no friend as loyal as a book.", author: "Ernest Hemingway" },
  { text: "Books are a uniquely portable magic.", author: "Stephen King" },
  { text: "A book is a dream that you hold in your hands.", author: "Neil Gaiman" },
  { text: "Reading is to the mind what exercise is to the body.", author: "Joseph Addison" },
  { text: "If you don't like to read, you haven't found the right book.", author: "J.K. Rowling" },
  { text: "Outside of a dog, a book is man's best friend. Inside of a dog it's too dark to read.", author: "Groucho Marx" },

  // On the mind
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "A man is but the product of his thoughts. What he thinks, he becomes.", author: "Mahatma Gandhi" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { text: "Our life is what our thoughts make it.", author: "Marcus Aurelius" },
  { text: "Change your thoughts and you change your world.", author: "Norman Vincent Peale" },
  { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
  { text: "You have power over your mind â not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "The empires of the future are the empires of the mind.", author: "Winston Churchill" },

  // On hard work
  { text: "Genius is one percent inspiration and ninety-nine percent perspiration.", author: "Thomas Edison" },
  { text: "The only place where success comes before work is in the dictionary.", author: "Vidal Sassoon" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Without hard work, nothing grows but weeds.", author: "Gordon B. Hinckley" },
  { text: "Striving for success without hard work is like trying to harvest where you haven't planted.", author: "David Bly" },
  { text: "I'm a great believer in luck, and I find the harder I work, the more I have of it.", author: "Thomas Jefferson" },

  // On perspective
  { text: "Everything we hear is an opinion, not a fact. Everything we see is a perspective, not the truth.", author: "Marcus Aurelius" },
  { text: "We don't see things as they are, we see them as we are.", author: "AnaÃ¯s Nin" },
  { text: "The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.", author: "Albert Einstein" },
  { text: "It is not the mountain we conquer, but ourselves.", author: "Edmund Hillary" },
  { text: "Change the way you look at things and the things you look at change.", author: "Wayne Dyer" },

  // On impermanence
  { text: "This too shall pass.", author: "Persian Adage" },
  { text: "Nothing is permanent in this wicked world â not even our troubles.", author: "Charlie Chaplin" },
  { text: "Impermanence is a principle of harmony. When we don't struggle against it, we are in harmony with reality.", author: "Pema ChÃ¶drÃ¶n" },
  { text: "Everything is temporary. Emotions, thoughts, people and scenery. Do not become attached, just flow with it.", author: "Unknown" },
  { text: "The flower that blooms in adversity is the rarest and most beautiful of all.", author: "Mulan" },

  // On gratitude
  { text: "Gratitude is not only the greatest of virtues, but the parent of all the others.", author: "Marcus Tullius Cicero" },
  { text: "Gratitude turns what we have into enough.", author: "Unknown" },
  { text: "The more grateful I am, the more beauty I see.", author: "Mary Davis" },
  { text: "Gratitude unlocks the fullness of life.", author: "Melody Beattie" },
  { text: "When you are grateful, fear disappears and abundance appears.", author: "Anthony Robbins" },

  // On solitude & thinking
  { text: "To think is to practice brain chemistry.", author: "Deepak Chopra" },
  { text: "Great thoughts come from the heart.", author: "Luc de Clapiers" },
  { text: "I think, therefore I am.", author: "RenÃ© Descartes" },
  { text: "Few is the number who think with their own mind and feel with their own heart.", author: "Albert Einstein" },

  // On suffering & pain
  { text: "The secret of life is to fall seven times and to get up eight times.", author: "Paulo Coelho" },
  { text: "Pain is inevitable. Suffering is optional.", author: "Haruki Murakami" },
  { text: "Out of suffering have emerged the strongest souls; the most massive characters are seared with scars.", author: "Khalil Gibran" },
  { text: "The wound is the place where the Light enters you.", author: "Rumi" },
  { text: "Character cannot be developed in ease and quiet. Only through experience of trial and suffering can the soul be strengthened.", author: "Helen Keller" },
  { text: "We must embrace pain and burn it as fuel for our journey.", author: "Kenji Miyazawa" },
  { text: "Pleasure is always derived from something outside you, whereas joy arises from within.", author: "Eckhart Tolle" },

  // On purpose
  { text: "The mystery of human existence lies not in just staying alive, but in finding something to live for.", author: "Fyodor Dostoevsky" },
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
  { text: "The two most important days in your life are the day you are born and the day you find out why.", author: "Mark Twain" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
  { text: "To live is to choose. But to choose well, you must know who you are and what you stand for.", author: "Kofi Annan" },

  // On beauty
  { text: "Everything has beauty, but not everyone sees it.", author: "Confucius" },
  { text: "Beauty is in the eye of the beholder.", author: "Margaret Wolfe Hungerford" },
  { text: "The world is full of magical things patiently waiting for our wits to grow sharper.", author: "Bertrand Russell" },
  { text: "The earth laughs in flowers.", author: "Ralph Waldo Emerson" },
  { text: "Beauty is not in the face; beauty is a light in the heart.", author: "Khalil Gibran" },

  // On justice & society
  { text: "Injustice anywhere is a threat to justice everywhere.", author: "Martin Luther King Jr." },
  { text: "The arc of the moral universe is long, but it bends toward justice.", author: "Martin Luther King Jr." },
  { text: "Law and order exist for the purpose of establishing justice and when they fail in this purpose they become the dangerously structured dams that block the flow of social progress.", author: "Martin Luther King Jr." },
  { text: "The price of apathy towards public affairs is to be ruled by evil men.", author: "Plato" },
  { text: "Justice will not be served until those who are unaffected are as outraged as those who are.", author: "Benjamin Franklin" },
  { text: "Equality is the soul of liberty; there is, in fact, no liberty without it.", author: "Frances Wright" },

  // On freedom
  { text: "Freedom is not worth having if it does not include the freedom to make mistakes.", author: "Mahatma Gandhi" },
  { text: "Man is born free, and everywhere he is in chains.", author: "Jean-Jacques Rousseau" },
  { text: "Freedom lies in being bold.", author: "Robert Frost" },
  { text: "Those who deny freedom to others deserve it not for themselves.", author: "Abraham Lincoln" },
  { text: "The truth will set you free.", author: "John 8:32" },

  // On leadership
  { text: "A leader is one who knows the way, goes the way, and shows the way.", author: "John C. Maxwell" },
  { text: "The greatest leader is not necessarily the one who does the greatest things. He is the one that gets the people to do the greatest things.", author: "Ronald Reagan" },
  { text: "Leadership is not about being in charge. It is about taking care of those in your charge.", author: "Simon Sinek" },
  { text: "The function of leadership is to produce more leaders, not more followers.", author: "Ralph Nader" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },

  // On technology & progress  
  { text: "Any sufficiently advanced technology is indistinguishable from magic.", author: "Arthur C. Clarke" },
  { text: "The science of today is the technology of tomorrow.", author: "Edward Teller" },
  { text: "Technology is best when it brings people together.", author: "Matt Mullenweg" },
  { text: "We are all now connected by the Internet, like neurons in a giant brain.", author: "Stephen Hawking" },
  { text: "The advance of technology is based on making it fit in so that you don't really even notice it.", author: "Bill Gates" },

  // On spirituality
  { text: "The soul that sees beauty may sometimes walk alone.", author: "Johann Wolfgang von Goethe" },
  { text: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.", author: "Rumi" },
  { text: "Out beyond ideas of wrongdoing and rightdoing there is a field. I'll meet you there.", author: "Rumi" },
  { text: "You were born with wings, why prefer to crawl through life?", author: "Rumi" },
  { text: "Let the beauty of what you love be what you do.", author: "Rumi" },
  { text: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.", author: "Rumi" },
  { text: "The universe is not outside of you. Look inside yourself; everything that you want, you already are.", author: "Rumi" },

  // On peace
  { text: "If you want peace, stop fighting. If you want peace of mind, stop fighting with your thoughts.", author: "Peter McWilliams" },
  { text: "Peace begins with a smile.", author: "Mother Teresa" },
  { text: "Peace is not absence of conflict, it is the ability to handle conflict by peaceful means.", author: "Ronald Reagan" },
  { text: "When the power of love overcomes the love of power, the world will know peace.", author: "Jimi Hendrix" },
  { text: "An eye for an eye will only make the whole world blind.", author: "Mahatma Gandhi" },

  // On humor
  { text: "A day without laughter is a day wasted.", author: "Charlie Chaplin" },
  { text: "If you could kick the person in the pants responsible for most of your trouble, you wouldn't sit for a month.", author: "Theodore Roosevelt" },
  { text: "Age is an issue of mind over matter. If you don't mind, it doesn't matter.", author: "Mark Twain" },
  { text: "I can resist everything except temptation.", author: "Oscar Wilde" },
  { text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", author: "Albert Einstein" },
  { text: "Always forgive your enemies; nothing annoys them so much.", author: "Oscar Wilde" },
  { text: "The only mystery in life is why the kamikaze pilots wore helmets.", author: "Al McGuire" },

  // On identity & belonging
  { text: "No man is an island, entire of itself; every man is a piece of the continent.", author: "John Donne" },
  { text: "We are all different, which is great because we are all unique. Without diversity, life would be very boring.", author: "Catherine Pulsifer" },
  { text: "I am not what happened to me. I am what I choose to become.", author: "Carl Gustav Jung" },
  { text: "The privilege of a lifetime is to become who you truly are.", author: "Carl Gustav Jung" },
  { text: "Until you make the unconscious conscious, it will direct your life and you will call it fate.", author: "Carl Gustav Jung" },

  // Famous short wisdom
  { text: "Less is more.", author: "Ludwig Mies van der Rohe" },
  { text: "Form follows function.", author: "Louis Sullivan" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "I am enough.", author: "Unknown" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "Think different.", author: "Apple" },
  { text: "To infinity and beyond.", author: "Buzz Lightyear" },
  { text: "Carpe diem â seize the day.", author: "Horace" },
  { text: "Amor fati â love your fate.", author: "Friedrich Nietzsche" },
  { text: "Memento mori â remember that you will die.", author: "Stoic Maxim" },
  { text: "Cogito ergo sum â I think, therefore I am.", author: "RenÃ© Descartes" },

  // Vietnamese wisdom (translated)
  { text: "Learning is like rowing upstream: not to advance is to drop back.", author: "Chinese Proverb" },
  { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Give a man a fish and you feed him for a day; teach a man to fish and you feed him for a lifetime.", author: "Chinese Proverb" },
  { text: "When the winds of change blow, some people build walls and others build windmills.", author: "Chinese Proverb" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "He who asks is a fool for five minutes, but he who does not ask remains a fool forever.", author: "Chinese Proverb" },

  // On darkness & light
  { text: "Even the darkest night will end and the sun will rise.", author: "Victor Hugo" },
  { text: "We can easily forgive a child who is afraid of the dark; the real tragedy of life is when men are afraid of the light.", author: "Plato" },
  { text: "There is a crack in everything, that's how the light gets in.", author: "Leonard Cohen" },
  { text: "It's not that the world is too dark but that we've grown used to not lighting ourselves up.", author: "Unknown" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Darkness cannot drive out darkness: only light can do that.", author: "Martin Luther King Jr." },

  // On doing vs. waiting
  { text: "The best time to start was yesterday. The next best time is now.", author: "Unknown" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Someday is not a day of the week.", author: "Janet Dailey" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "First, think. Second, dream. Third, believe. And finally, dare.", author: "Walt Disney" },

  // On simplicity of living
  { text: "Simplicity is the keynote of all true elegance.", author: "Coco Chanel" },
  { text: "It is not the man who has too little, but the man who craves more, that is poor.", author: "Seneca" },
  { text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" },
  { text: "The greatest wealth is to live content with little.", author: "Plato" },
  { text: "Not what we have but what we enjoy, constitutes our abundance.", author: "Epicurus" },
  { text: "He is richest who is content with the least.", author: "Socrates" },
  { text: "Have nothing in your house that you do not know to be useful, or believe to be beautiful.", author: "William Morris" },

  // On questions
  { text: "Judge a man by his questions rather than by his answers.", author: "Voltaire" },
  { text: "The important thing is not to stop questioning. Curiosity has its own reason for existing.", author: "Albert Einstein" },
  { text: "The art and science of asking questions is the source of all knowledge.", author: "Thomas Berger" },
  { text: "Quality questions create a quality life.", author: "Anthony Robbins" },
  { text: "We learn more by looking for the answer to a question and not finding it than we do from learning the answer itself.", author: "Lloyd Alexander" },

  // On memory & history
  { text: "Those who cannot remember the past are condemned to repeat it.", author: "George Santayana" },
  { text: "History will be kind to me for I intend to write it.", author: "Winston Churchill" },
  { text: "The most effective way to destroy people is to deny and obliterate their own understanding of their history.", author: "George Orwell" },
  { text: "We are not makers of history. We are made by history.", author: "Martin Luther King Jr." },

  // On giving
  { text: "We make a living by what we get, but we make a life by what we give.", author: "Winston Churchill" },
  { text: "The meaning of life is to find your gift. The purpose of life is to give it away.", author: "Pablo Picasso" },
  { text: "No one has ever become poor by giving.", author: "Anne Frank" },
  { text: "It's not how much we give but how much love we put into giving.", author: "Mother Teresa" },
  { text: "We rise by lifting others.", author: "Robert Ingersoll" },

  // On observation
  { text: "The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.", author: "Marcel Proust" },
  { text: "There are only two ways to live your life. One is as though nothing is a miracle. The other is as though everything is a miracle.", author: "Albert Einstein" },
  { text: "Look at everything always as though you were seeing it either for the first or last time.", author: "Betty Smith" },
  { text: "The world is a book and those who do not travel read only one page.", author: "Saint Augustine" },

  // On solitude
  { text: "Without great solitude no serious work is possible.", author: "Pablo Picasso" },
  { text: "The more powerful and original a mind, the more it will incline towards the religion of solitude.", author: "Aldous Huxley" },
  { text: "I restore myself when I'm alone.", author: "Marilyn Monroe" },
  { text: "It is only when we silent the blaring sounds of our daily existence that we can finally hear the whispers of truth.", author: "K.T. Jong" },

];
