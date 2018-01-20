export const LANG = {
  en: {
    langName: "English",
    icon: "/static/flag-en.png",
    navbar: {
      play: "Play",
      profile: "Profile",
      editor: "Editor",
      tutorial: "Tutorial",
      logOut: "Log out",
      logIn: "Log in",
      signUp: "Sign up"
    },
    mainMenu: {
      playTab: {
        pileTypesAndAmounts: "Pile Types and Amounts",
        routeLength: "Route Length",
        storageAreaAmount: "Storage Area Amount",
        roadAnomalies: "Road Anomalies"
      },
      profileTab: {
        profile: "Profile",
        noScoresFound: "You don't have any scores yet!",
        cost: "Cost",
        map: "Map",
        info: "Info"
      },
      loginSignupForm: {
        username: "username",
        password: "password",
        email: "email",
        messages: {
          wrongUsernameOrPassword: "Wrong username or password",
          usernameExists: "That username already exists",
          emailExists: "An account with that email address already exists",
          usernameRequired: "Please enter a username",
          passwordRequired: "Please enter a password",
          emailRequired: "Please enter an email address",
          usernameTooShort: "Username must be between 3 and 15 characters in length",
          usernameTooLong: "Username must be between 3 and 15 characters in length",
          passwordTooShort: "Password must be between 6 and 50 characters in length",
          passwordTooLong: "Password must be between 6 and 50 characters in length",
          emailInvalid: "Please enter a valid email address"
        }
      }
    },
    report: {
      report: "Report",
      map: "Map",
      stats: "Stats",
      workingTime: "Working time",
      distanceTravelled: "Distance travelled",
      fuelConsumed: "Fuel consumed",
      logsCollected: "Logs collected",
      finalCost: "Total cost",
      close: "Close",
      details: "Show details",
      dismissDetails: "Dismiss details"
    },
    detailedReport: {
      time: "Time (hh:mm:ss)",
      workingTime: "Working time",
      drivingUnloadedTime: "Driving unloaded",
      drivingLoadedTime: "Driving loaded",
      loadingUnloadingTime: "Loading & Unloading",
      idling: "Idling",

      distance: "Distance (m)",
      distanceTravelled: "Distance travelled",
      drivingForwardTime: "Driving forward",
      drivingBackwardTime: "Reverse",
      drivingUnloadedDistance: "Driving unloaded",
      drivingLoadedDistance: "Driving loaded",

      costTitle: "Cost (€)",
      fuelConsumed: "Fuel consumed",
      fuelCost: "Fuel cost",
      workerSalary: "Worker salary",

      productivityTitle: "Productivity",
      loadsTransported: "Loads transported (pc.)",
      logsDeposited: "Logs deposited (pc.)",
      totalVolume: "Total volume (m3)",
      productivity: "Productivity (m3/h)"
    },
    game: {
      time: "Time",
      distance: "Distance",
      fuelConsumed: "Fuel consumed",
      cost: "Cost",
      logsRemaining: "Logs remaining",
      levelFinished: 'Level finished!'
    },
    editor: {
      selectedTool: "Selected tool",
      tools: "Tools",
      toolType: "Tool type",
      free: "Free",
      normalRoad: "Normal road",
      dyingRoad: "Crossing limited road",
      weightLimitedRoad: "Weight limited road",
      onewayRoad: "One-way road",
      saveAsNewLevel: "Save as new level",
      weather: "Weather",
      enableFog: "Enable fog",
      fogDensity: "Density",
      fogVisibility: "Visibility",
      info: "Info",
      toolInfo: {
        road: "Click anywhere to draw a road. Double click to end the road.",
        roadWeightlimit: "Click the middle of a road segment to apply a weight limit. Adjust the weight limit value by hovering over the current value and using number keys or the mouse wheel.",
        roadDying: "Click the middle of a road segment to apply a crossing limit. Adjust the crossing limit value by hovering over the current value and using number keys or the mouse wheel.",
        roadOneway: "Click the middle of a road segment to make it a one way road. Click again to change direction.",
        log: "Click anywhere next to a road to place a log. You can select the assortment type with the tool type dropdown menu.",
        deposit: "Click anywhere next to a road to place a deposit. You can select the accepted assortment type with the tool type dropdown menu.",
        truck: "Click anywhere on a road to set the truck starting position. Change the starting direction with right click.",
        remove: "Click anything to remove it from the level."
      },
      messages: {
        levelSaved: "Level saved",
        levelLoaded: "Level loaded",
        levelDeleted: "Level deleted",
        levelInvalid: "Level doesn`t have truck or logs or there is not enough log deposits for different log types"
      }
    },
    buttons: {
      startGame: "Start game",
      logIn: "Log in",
      signUp: "Sign up",
      loadingSignUp: "Signing up... please wait!",
      loadingLogIn: "Logging in... please wait!",
      quit: "Quit",
      report: "Report",
      road: "Road",
      anomalies: "Anomalies",
      logs: "Logs",
      deposits: "Deposits",
      truck: "Truck",
      remove: "Remove",
      save: "Save",
      saveAs: "Save as",
      loadLevel: "Load level",
      menu: "Menu",
      back: "Back",
      cancel: "Cancel"
    },
    logs: {
      type1: "Type 1",
      type2: "Type 2",
      type3: "Type 3",
      type4: "Type 4",
      type5: "Type 5",
      type6: "Type 6",
    }
  },
  fi: {
    langName: "Suomi",
    icon: "/static/flag-fi.png",
    navbar: {
      play: "Pelaa",
      profile: "Profiili",
      editor: "Editori",
      tutorial: "Ohje",
      logOut: "Kirjaudu ulos",
      logIn: "Kirjaudu sisään",
      signUp: "Rekisteröidy"
    },
    mainMenu: {
      playTab: {
        pileTypesAndAmounts: "Puutyypit ja lukumäärät",
        routeLength: "Tien pituus",
        storageAreaAmount: "Säilytysalueet",
        roadAnomalies: "Tiemuuttujat"
      },
      profileTab: {
        profile: "Profiili",
        noScoresFound: "Sinulla ei ole vielä tuloksia!",
        cost: "Kulut",
        map: "Kartta",
        info: "Tiedot"
      },
      loginSignupForm: {
        username: "käyttäjänimi",
        password: "salasana",
        email: "sähköposti",
        messages: {
          wrongUsernameOrPassword: "Väärä käyttäjänimi tai salasana",
          usernameExists: "Käyttäjänimi on varattu",
          emailExists: "Sähköpostiosoite on varattu",
          usernameRequired: "Käyttäjänimi vaaditaan",
          passwordRequired: "Salasana vaaditaan",
          emailRequired: "Sähköpostiosoite vaaditaan",
          usernameTooShort: "Käyttäjänimen on oltava 3-15 merkkiä pitkä",
          usernameTooLong: "Käyttäjänimen on oltava 3-15 merkkiä pitkä",
          passwordTooShort: "Salasanan on oltava 6-50 merkkiä pitkä",
          passwordTooLong: "Salasanan on oltava 6-50 merkkiä pitkä",
          emailInvalid: "Syötä sähköpostiosoite oikeassa muodossa"
        }
      }
    },
    report: {
      report: "Raportti",
      map: "Kartta",
      stats: "Tilastot",
      workingTime: "Työskentelyaika",
      distanceTravelled: "Matkustettu etäisyys",
      fuelConsumed: "Polttoaineen kulutus",
      logsCollected: "Puita kerätty",
      finalCost: "Työn kulut",
      close: "Sulje",
      details: "Näytä tilastot",
      dismissDetails: "Sulje tilastot"
    },
    detailedReport: {
      time: "Aika (tt:mm:ss)",
      workingTime: "Työskentelyaika",
      drivingUnloadedTime: "Tyhjällä kuormalla ajo",
      drivingLoadedTime: "Lastin kanssa ajo",
      loadingUnloadingTime: "Lastaus & Tyhjennys",
      idling: "Toimeton",

      distance: "Matka (m)",
      distanceTravelled: "Matkustettu etäisyys",
      drivingForwardTime: "Eteenpäin ajo",
      drivingBackwardTime: "Peruuttaminen",
      drivingUnloadedDistance: "Tyhjällä kuormalla ajo",
      drivingLoadedDistance: "Lastin kanssa ajo",

      costTitle: "Kulut (€)",
      fuelConsumed: "Polttoaineen kulutus",
      fuelCost: "Polttoaineen kokonaishinta",
      workerSalary: "Työntekijän palkka",

      productivityTitle: "Productivity",
      loadsTransported: "Lasteja kuljetettu (kpl)",
      logsDeposited: "Puita kuljetettu (kpl)",
      totalVolume: "Kokonaistilavuus (m3)",
      productivity: "Tuottavuus (m3/t)"
    },
    game: {
      time: "Aika",
      distance: "Matka",
      fuelConsumed: "Polttoaine",
      cost: "Kustannukset",
      logsRemaining: "Tukkeja jäljellä",
      levelFinished: 'Taso läpäisty!'
    },
    editor: {
      selectedTool: "Valittu työkalu",
      tools: "Työkalut",
      toolType: "Työkalun tyyppi",
      free: "Vapaa",
      normalRoad: "Normaali tie",
      dyingRoad: "Ylitysrajoitettu tie",
      weightLimitedRoad: "Painorajoitettu tie",
      onewayRoad: "Yksisuuntainen tie",
      saveAsNewLevel: "Tallenna uutena tasona",
      weather: "Säätila",
      enableFog: "Sumu",
      fogDensity: "Tiheys",
      fogVisibility: "Näkyvyys",
      info: "Tietoja",
      toolInfo: {
        road: "Klikkaa piirtääksesi tie. Lopeta piirto tuplaklikkaamalla.",
        roadWeightlimit: "Klikkaa tiesegmentin keskikohtaa lisätäksesi painorajoituksen. Voit säätää painorajoitusta pitämällä hiirtä rajoitusarvon päällä ja käyttämällä numeronäppäimiä tai hiiren rullaa.",
        roadDying: "Klikkaa tiesegmentin keskikohtaa lisätäksesi ylitysrajoituksen. Voit säätää ylitysrajoitusta pitämällä hiirtä rajoitusarvon päällä ja käyttämällä numeronäppäimiä tai hiiren rullaa.",
        roadOneway: "Klikkaa tiesegmentin keskikohtaa tehdäksesi siitä yksisuuntaisen. Klikkaa uudestaan vaihtaaksesi suuntaa.",
        log: "Klikkaa tien vierusta asettaaksesi tukin. Voit muuttaa puutavaralajia työkalun tyyppi -valinnalla.",
        deposit: "Klikkaa tien vierusta asettaaksesi säilöntäalueen. Voit muuttaa hyväksyttyä puutavaralajia työkalun tyyppi -valinnalla.",
        truck: "Klikkaa haluamaasi tien kohtaa asettaaksesi aloituspisteen. Vaihda aloitussuuntaa oikealla hiiren painiketta.",
        remove: "Klikkaa mitä vain poistaaksesi sen tasosta."
      },
      messages: {
        levelSaved: "Taso tallennettu",
        levelLoaded: "Taso ladattu",
        levelDeleted: "Taso poistettu",
        levelInvalid: "Tasolla ei ole aloituspistettä tai puutavaraa tai siinä on liian vähän säilöntäalueita eri puutavaralajeille"
      }
    },
    buttons: {
      startGame: "Aloita peli",
      logIn: "Kirjaudu sisään",
      signUp: "Rekisteröidy",
      loadingSignUp: "Rekisteröidytään... odota hetki!",
      loadingLogIn: "Kirjaudutaan... odota hetki!",
      quit: "Lopeta",
      report: "Raportti",
      road: "Tie",
      logs: "Tukki",
      truck: "Metsäkone",
      deposits: "Säilö",
      remove: "Poista",
      save: "Tallenna",
      saveAs: "Tallenna nimellä",
      loadLevel: "Lataa taso",
      menu: "Valikko",
      back: "Takaisin",
      cancel: "Peruuta"
    },
    logs: {
      type1: "Tyyppi 1",
      type2: "Tyyppi 2",
      type3: "Tyyppi 3",
      type4: "Tyyppi 4",
      type5: "Tyyppi 5",
      type6: "Tyyppi 6",
    }
  }
}
