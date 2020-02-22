userSchema.methods.statsBlurb = async function() {
    // Get user
      let user = await User.fromDiscordId(message.author.id);
      let handle = user.handle;
      let resonite = user.resonite;
    let numCharacters = 0; // querey all characters by user's mongooseID
    let character = 0; // primary character
    let adventures = 0; // querey all adventures including user's mongooseID
      // get character
  
      // stats for: player name
      // 45623 Resonite
      // Characters: n active/m total
      // default character: char name
      // > lvl 4 Gnomish Ice Wizard
      // > (300 xp till lvl 5)
      // > HP: 43/56
      // > Hit Dice: 3/4
      // > Currently fishing in Foxbarrow (Autumnshade Pinensula)
      // > 231 gp 9 sp 3 cp
      // > Conditions:
      // >  - Swamp Sickness
      // >  - Broken Toenail
      // Adventures: 3 planned
      // > Next Adventure: Bullywug Breakout
      // > 4/13/2020, 6pm, @Warchief
  }