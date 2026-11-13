describe('应用导航', () => {
  it('从根地址跳转到首页并渲染布局', () => {
    cy.visit('/');
    cy.location('pathname').should('eq', '/base/home');
    cy.get('.layout-head').should('be.visible');
    cy.get('.layout-content .home').should('be.visible');
    cy.contains('.layout-head a', '数据源').click();
    cy.location('pathname').should('eq', '/base/data/source');
    cy.contains('.layout-head a', '首页').click();
    cy.location('pathname').should('eq', '/base/home');
  });
});

describe('图表编辑器物料面板', () => {
  it('按类别和系列筛选物料，切换类别时重置系列', () => {
    cy.visit('/chart/editor');
    cy.get('.component-item').should('have.length', 7);

    cy.get('.custom-select-size').eq(1).click();
    cy.contains('.n-base-select-option', '柱状图').click();
    cy.get('.component-item').should('have.length', 2);

    cy.get('.custom-select-size').eq(0).click();
    cy.contains('.n-base-select-option', '控件').click();
    cy.get('.component-item').should('have.length', 1).and('contain.text', '普通边框');
  });

  it('将物料拖入带标尺的画布并渲染对应组件', () => {
    cy.visit('/chart/editor');
    cy.get('.sketchpad-ruler-real').should('exist');
    cy.get('.custom-select-size').eq(0).click();
    cy.contains('.n-base-select-option', '控件').click();

    cy.window().then((window) => {
      const dataTransfer = new window.DataTransfer();
      cy.contains('.component-item', '普通边框').trigger('dragstart', { dataTransfer });
      cy.then(() => {
        expect(JSON.parse(dataTransfer.getData('DragKey'))).to.include({
          uuid: 'VFrame-1',
          loadPath: '../packages/frame/VFrame'
        });
      });
      cy.get('.sketchpad-wrapper').trigger('drop', { dataTransfer });
    });
    cy.contains('.shape-box', '边框').should('exist');
  });
});
