
export default () => {
  return (
    <div>
      <div className="com_header">
        <div className="com_title">topic</div>
      </div>
      <div className="com_body">
        <div>
          <h2>recent</h2>
          <div className="com_cards">
            <div className="com_card">
              <h3>书单</h3>
              <div className="com_secondary">书籍专题分类</div>
            </div>
            <div className="com_card">
              <h3>架构设计</h3>
              <div className="com_secondary">架构原理、设计方法</div>
            </div>
            <div className="com_card">
              <h3>领域驱动设计</h3>
              <div className="com_secondary">DDD理论、设计方法</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
