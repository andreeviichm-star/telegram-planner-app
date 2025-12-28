// Ultra-simple version for testing
export default function TasksPageSimple() {
  console.log('📋 TasksPageSimple: Rendering')
  
  return (
    <div className="tasks-page" style={{ padding: '20px', color: 'white' }}>
      <h1>FLUXPLANNER</h1>
      <p>Simple version - if you see this, basic rendering works!</p>
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        background: 'red',
        color: 'white',
        padding: '5px',
        zIndex: 99999,
        fontSize: '12px'
      }}>
        TEST: Simple version rendered
      </div>
    </div>
  )
}

