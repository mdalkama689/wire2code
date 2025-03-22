import { Code2 } from 'lucide-react'
import React from 'react'

function Footer() {
  return (
    <footer className="py-12 ">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="h-6 w-6" />
          <span className="font-semibold">Wire2Code</span>
        </div>
        <p className="text-sm ">
          © {new Date().getFullYear()} Wire2Code. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
  )
}

export default Footer