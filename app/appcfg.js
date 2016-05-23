(function() {

  module.exports = {
    defaultModule: 'occupy',
    modules: {
      occupy: {
        path: 'modules/occupy',
        name: 'OccupyModule',
        url: '/app/occupy/view',
        state: 'app.occupy',
        label: 'Occupy Visualization',
        tooltip: 'How the occupy movement spread and disappears',
        icon: 'blur_on'
      }
    }
  };

})();
